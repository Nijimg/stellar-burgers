import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchFeedThunk } from '@thunks';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFeedThunk());
  }, [dispatch]);

  const orders = useAppSelector((s) => s.orders.feed);
  const isLoading = useAppSelector((s) => s.orders.isLoading);
  const error = useAppSelector((s) => s.orders.error);

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-medium mt-10'>
        Ошибка загрузки ленты: {error}
      </p>
    );
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeedThunk())} />
  );
};
