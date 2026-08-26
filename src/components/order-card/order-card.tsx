import { FC, memo, useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { fetchOrderByNumberThunk } from '@thunks';

const maxIngredients = 6;
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);
  const currentOrder = useAppSelector((state) => state.orders.currentOrder);
  const ingredients = useAppSelector((s) => s.ingredients.ingredients);

  useEffect(() => {
    if (orderNumber) {
      dispatch(fetchOrderByNumberThunk(orderNumber));
    }
  }, [dispatch, orderNumber]);

  const orderInfo = useMemo(() => {
    const targetOrder = order || currentOrder;
    if (!targetOrder || !ingredients.length) return null;

    const ingredientsInfo = targetOrder.ingredients
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter(Boolean) as TIngredient[];

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(targetOrder.createdAt);

    return {
      ...targetOrder,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, currentOrder, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
