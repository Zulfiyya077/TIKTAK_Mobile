import { AccountStack } from './AccountStack';
import { useLogoutRequest } from './LogoutContext';

/** Tab.Screen üçün stabil `component` — `onLogout` kontekstdən */
export function AccountTabContainer() {
  const onLogout = useLogoutRequest();
  return <AccountStack onLogout={onLogout} />;
}
