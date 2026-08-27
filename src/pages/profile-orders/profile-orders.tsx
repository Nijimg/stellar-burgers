import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { selectUser } from '@slices';
import { fetchUserOrdersThunk } from '@thunks';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const orders: TOrder[] = useAppSelector((s) => s.orders.userOrders || []);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrdersThunk());
    }
  }, [dispatch, user]);

  return <ProfileOrdersUI orders={orders} />;
};
