import { createContext, useContext } from 'react';

export const LogoutContext = createContext<() => void>(() => {});

export function useLogoutRequest() {
  return useContext(LogoutContext);
}
