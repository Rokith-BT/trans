import { LocalStorage } from '@/services';

export const isPremitted = (module?: string, action?: string) => {
  const permissions = LocalStorage.read('permission') || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredModule = permissions.find((x: any) => x.module === module);
  if (filteredModule) {
    const { permission } = filteredModule;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentAction = permission.find((y: any) => y.startsWith(action));
    if (currentAction) {
      const splitedAction = currentAction.split(':');
      if (splitedAction.length === 2) {
        return splitedAction[1] === 'any' ? true : false;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};
