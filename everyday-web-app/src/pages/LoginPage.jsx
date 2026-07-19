import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@features/auth/hooks/useLogin';
import { ROUTE_PATHS } from '@shared/constant/route-paths';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    login.mutate(
      { email, password },
      { onSuccess: () => navigate(ROUTE_PATHS.EVENTS) },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{t('common.login')}</h1>
      <input type="email" placeholder={t('common.email')} value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder={t('common.password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit" disabled={login.isPending}>{t('common.login')}</button>
      {login.isError && <p role="alert">{login.error?.response?.data?.message ?? 'Login failed'}</p>}
    </form>
  );
};

export default LoginPage;
