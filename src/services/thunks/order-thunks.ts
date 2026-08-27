import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi,
  TNewOrder
} from '@api';
import { clearConstructor } from '@slices';

type FeedsPayload = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export const fetchFeedThunk = createAsyncThunk<
  FeedsPayload,
  void,
  { rejectValue: string }
>('orders/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return data;
  } catch (err: unknown) {
    console.error('fetchFeedThunk error:', err);

    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }

    return rejectWithValue('Ошибка загрузки ленты заказов');
  }
});

export const fetchOrderByNumberThunk = createAsyncThunk<
  TOrder | undefined,
  number,
  { rejectValue: string }
>('orders/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }

    return rejectWithValue('Не удалось получить заказ');
  }
});

export const fetchUserOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const data = await getOrdersApi();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }

    return rejectWithValue('Не удалось получить заказы пользователя');
  }
});

export const createOrderThunk = createAsyncThunk<
  TNewOrder,
  string[],
  { rejectValue: string }
>(
  'orders/createOrder',
  async (ingredientsIds, { dispatch, rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientsIds);

      dispatch(clearConstructor());

      queueMicrotask(() => dispatch(fetchUserOrdersThunk()));

      return data.order;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }

      return rejectWithValue('Не удалось создать заказ');
    }
  }
);
