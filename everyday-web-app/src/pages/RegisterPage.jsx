import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '@features/auth/hooks/useRegister';
import { ROUTE_PATHS } from '@shared/constant/route-paths';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const register = useRegister();
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });

  const handleChange = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    register.mutate(form, { onSuccess: () => navigate(ROUTE_PATHS.EVENTS) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{t('common.register')}</h1>
      <input placeholder={t('common.fullName')} value={form.fullName} onChange={handleChange('fullName')} required />
      <input type="email" placeholder={t('common.email')} value={form.email} onChange={handleChange('email')} required />
      <input type="password" placeholder={t('common.password')} value={form.password} onChange={handleChange('password')} required />
      <button type="submit" disabled={register.isPending}>{t('common.register')}</button>
      {register.isError && <p role="alert">{register.error?.response?.data?.message ?? 'Registration failed'}</p>}
    </form>
  );
};

export default RegisterPage;
