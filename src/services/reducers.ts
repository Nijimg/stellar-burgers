import { combineSlices } from '@reduxjs/toolkit';
import {
  ingredientsSlice,
  userReducer,
  ordersSlice,
  constructorSlice
} from './slices';

export const rootReducer = combineSlices({
  ingredients: ingredientsSlice,
  user: userReducer,
  orders: ordersSlice,
  constructorBurger: constructorSlice
});
