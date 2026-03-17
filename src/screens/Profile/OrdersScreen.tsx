import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SelectedOrdersLayout } from '../../layouts/orders';
import { OrderService } from '../../api/wooApi2';
import { useShop } from '../../store/shopStore';

const OrdersScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { user, isAuthenticated } = useShop();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const status = route.params?.status ?? 'pending';

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user?.id) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await OrderService.getUserOrders(user.id, status);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user?.id, status]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate('Auth' as never);
  };

  return (
    <SelectedOrdersLayout
      orders={orders}
      loading={loading}
      isAuthenticated={isAuthenticated}
      status={status}
      onBack={handleBack}
      onLogin={handleLogin}
    />
  );
};

export default OrdersScreen;