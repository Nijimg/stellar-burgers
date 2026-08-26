import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { TNewOrder } from '@api';
import {
  fetchFeedThunk,
  fetchOrderByNumberThunk,
  fetchUserOrdersThunk,
  createOrderThunk
} from '../thunks/order-thunks';

type OrdersState = {
  feed: TOrder[];
  userOrders: TOrder[];
  currentOrder?: TOrder;
  createdOrder?: TNewOrder;
  isLoading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
};

const initialState: OrdersState = {
  feed: [],
  userOrders: [],
  currentOrder: undefined,
  createdOrder: undefined,
  isLoading: false,
  error: null,
  total: 0,
  totalToday: 0
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder(state) {
      state.currentOrder = undefined;
      state.createdOrder = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // feed
      .addCase(fetchFeedThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchOrderByNumberThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOrder = undefined;
      })
      .addCase(fetchOrderByNumberThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumberThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createdOrder = undefined;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdOrder = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
