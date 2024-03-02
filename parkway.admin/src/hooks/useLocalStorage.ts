import { useState } from 'react';

export const useLocalStorage = <T>(
  keyName: string,
  defaultValue: T | undefined
): [T | undefined, (user: T | undefined) => void, () => void] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value) as T;
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue: T | undefined) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };

  const clearValue = () => {
    try {
      window.localStorage.removeItem(keyName);
    } catch (err) {
      console.log(err);
    }
  };

  return [storedValue, setValue, clearValue];
};
