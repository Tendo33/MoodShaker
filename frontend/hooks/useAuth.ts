import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export function useAuth() {
  const { user, loading, error, login, register, logout, updateUser, updateAvatar, resetPassword } = useUser();
  const router = useRouter();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const requireAuth = () => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
      return false;
    }
    return true;
  };

  const requireAdmin = () => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
      return false;
    }
    return true;
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateUser,
    updateAvatar,
    resetPassword,
    requireAuth,
    requireAdmin,
  };
} 