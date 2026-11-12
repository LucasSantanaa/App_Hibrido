import React, { createContext, useContext } from 'react';
import usePersistentValue from '../hooks/usePersistentValue';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser, loading, storageError] = usePersistentValue(
    'sabor-express:user',
    null
  );

  function signIn(email) {
    setUser({ email: email || 'convidado@saborexpress.com' });
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading, storageError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }
  return context;
}
