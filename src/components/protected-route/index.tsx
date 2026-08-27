import React, { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { selectIsAuthChecked, selectUser } from '@slices';

type ProtectedRouteProps = {
  children?: ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const user = useAppSelector(selectUser);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export const UnAuthRoute = (props: ProtectedRouteProps) => (
  <ProtectedRoute onlyUnAuth {...props} />
);
