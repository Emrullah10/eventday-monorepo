import { useMutation } from '@tanstack/react-query';
import { authApi } from '@api/auth.api';
import { useAuthStore } from '@store/useAuthStore';

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => setUser(data.user),
  });
};
