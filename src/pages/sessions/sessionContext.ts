import { ContextContainer } from '@/services';

export const { useContext: useSession, Provider: SessionProvider } = ContextContainer(() => {
  return {
    actions: {
      
    }
  };
});
