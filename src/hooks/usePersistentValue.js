import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function usePersistentValue(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(key)
      .then((storedValue) => {
        if (active && storedValue !== null) {
          setValue(JSON.parse(storedValue));
        }
      })
      .catch((storageError) => {
        console.error(`Falha ao carregar "${key}" do armazenamento local.`, storageError);
        if (active) setError(`Não foi possível carregar os dados locais (${key}).`);
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (!ready || error) return;

    AsyncStorage.setItem(key, JSON.stringify(value)).catch((storageError) => {
      console.error(`Falha ao salvar "${key}" no armazenamento local.`, storageError);
      setError(`Não foi possível salvar os dados locais (${key}).`);
    });
  }, [error, key, ready, value]);

  return [value, setValue, !ready, error];
}
