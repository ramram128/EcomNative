import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50, // Gives the loader some breathing room from the top
      },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1A1A1A',
      paddingHorizontal: 15,
      paddingTop: 15,
      marginBottom: 10,
    },
    listContainer: {
      paddingHorizontal: 8,
      paddingBottom: 20,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      color: '#666',
    },
    card: {
      flex: 0.5,
      backgroundColor: '#FFFFFF',
      margin: 8,
      borderRadius: 12,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      overflow: 'hidden',
    },
    imageContainer: {
      width: '100%',
      height: 160, // Fixed height is required for remote images
      backgroundColor: '#E1E1E1', // Shows as grey if image fails to load
    },
    image: {
      width: '100%',
      height: '100%',
    },
    details: {
      padding: 10,
    },
    name: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    price: {
      fontSize: 15,
      color: '#28A745',
      fontWeight: 'bold',
    },
    oldPrice: {
      fontSize: 11,
      color: '#999',
      textDecorationLine: 'line-through',
      marginLeft: 6,
    },
  });