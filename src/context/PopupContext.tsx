import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants/theme';

type PopupType = 'success' | 'error' | 'info' | 'warning';

interface PopupState {
  visible: boolean;
  title: string;
  message: string;
  type: PopupType;
  onConfirm?: () => void;
  isToast?: boolean;
}

interface PopupContextValue {
  showToast: (title: string, message: string, type?: PopupType) => void;
  showAlert: (title: string, message: string, type?: PopupType, onConfirm?: () => void) => void;
  hidePopup: () => void;
}

const PopupContext = createContext<PopupContextValue | null>(null);

const { width, height } = Dimensions.get('window');

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PopupState>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    isToast: false,
  });

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(state.isToast ? -100 : 50));

  const showPopup = useCallback((newState: Partial<PopupState>) => {
    setState(prev => ({ ...prev, ...newState, visible: true }));
    
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(newState.isToast ? -100 : 50);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: newState.isToast ? 50 : 0,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();

    if (newState.isToast) {
      setTimeout(() => {
        hidePopup();
      }, 3000);
    }
  }, [fadeAnim, slideAnim]);

  const hidePopup = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: state.isToast ? -100 : 50,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setState(prev => ({ ...prev, visible: false }));
    });
  }, [fadeAnim, slideAnim, state.isToast]);

  const showToast = (title: string, message: string, type: PopupType = 'success') => {
    showPopup({ title, message, type, isToast: true });
  };

  const showAlert = (title: string, message: string, type: PopupType = 'info', onConfirm?: () => void) => {
    showPopup({ title, message, type, isToast: false, onConfirm });
  };

  const getIcon = (type: PopupType) => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'warning';
      default: return 'information-circle';
    }
  };

  const getTypeColor = (type: PopupType) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      default: return COLORS.primary;
    }
  };

  return (
    <PopupContext.Provider value={{ showToast, showAlert, hidePopup }}>
      {children}
      {state.visible && (
        <View style={StyleSheet.absoluteFill} pointerEvents={state.isToast ? "box-none" : "auto"}>
          {/* Overlay for Alert */}
          {!state.isToast && (
            <Animated.View 
              style={[styles.overlay, { opacity: fadeAnim }]} 
              onStartShouldSetResponder={() => true}
              onResponderRelease={hidePopup}
            />
          )}

          {/* Popup Container */}
          <Animated.View style={[
            state.isToast ? styles.toastContainer : styles.alertContainer,
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}>
            <LinearGradient
              colors={['#1F1F2E', '#161625']}
              style={styles.gradient}
            >
              <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: getTypeColor(state.type) + '20' }]}>
                  <Ionicons name={getIcon(state.type)} size={28} color={getTypeColor(state.type)} />
                </View>
                
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{state.title}</Text>
                  <Text style={styles.message}>{state.message}</Text>
                </View>

                {!state.isToast && (
                  <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={hidePopup}>
                      <Text style={styles.buttonText}>Dismiss</Text>
                    </TouchableOpacity>
                    {state.onConfirm && (
                      <TouchableOpacity 
                        style={[styles.button, styles.primaryButton, { backgroundColor: getTypeColor(state.type) }]}
                        onPress={() => {
                           state.onConfirm?.();
                           hidePopup();
                        }}
                      >
                        <Text style={[styles.buttonText, { color: '#fff' }]}>Confirm</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      )}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error('usePopup must be used inside PopupProvider');
  return ctx;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  alertContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  gradient: {
    borderRadius: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#A0A0B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  primaryButton: {
    elevation: 4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#A0A0B8',
  },
});
