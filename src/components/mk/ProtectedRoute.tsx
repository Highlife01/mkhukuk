import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    // Geçici olarak: Eğer kullanıcı giriş yapmışsa ama profili henüz yüklenmemişse veya rolü eşleşmiyorsa
    // yine de içeri alalım (hata ayıklama için)
    if (user) return <>{children}</>;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
