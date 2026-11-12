import React, { createContext, useContext } from 'react';
import usePersistentValue from '../hooks/usePersistentValue';

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders, loading, storageError] = usePersistentValue(
    'sabor-express:orders',
    []
  );

  function placeOrder(details) {
    const order = {
      ...details,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Recebido',
    };
    setOrders((current) => [order, ...current]);
    return order;
  }

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, loading, storageError }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders precisa ser usado dentro de um OrdersProvider');
  }
  return context;
}
