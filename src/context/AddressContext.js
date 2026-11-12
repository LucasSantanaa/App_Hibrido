import React, { createContext, useContext } from 'react';
import usePersistentValue from '../hooks/usePersistentValue';

const AddressContext = createContext(null);

export function AddressProvider({ children }) {
  const [addresses, setAddresses, loading, storageError] = usePersistentValue(
    'sabor-express:addresses',
    []
  );

  function saveAddress(address) {
    setAddresses((current) => {
      const exists = current.some((item) => item.id === address.id);
      return exists
        ? current.map((item) => (item.id === address.id ? address : item))
        : [...current, { ...address, id: `${Date.now()}` }];
    });
  }

  function removeAddress(addressId) {
    setAddresses((current) => current.filter((item) => item.id !== addressId));
  }

  return (
    <AddressContext.Provider
      value={{ addresses, saveAddress, removeAddress, loading, storageError }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddresses precisa ser usado dentro de um AddressProvider');
  }
  return context;
}
