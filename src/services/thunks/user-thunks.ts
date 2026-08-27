import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
  TLoginData,
  TRegisterData,
  TAuthResponse,
  TUserResponse
} from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

export const setIsAuthChecked = createAction<boolean>('user/setIsAuthChecked');

export const registerUserThunk = createAsyncThunk<
  TAuthResponse,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(data);

    const rawAccess = res.accessToken ?? '';
    const accessToken =
      typeof rawAccess === 'string'
        ? rawAccess.replace(/^Bearer\s+/i, '')
        : rawAccess;
    const refreshToken = res.refreshToken ?? '';

    if (accessToken) setCookie('accessToken', `Bearer ${accessToken}`);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

    return res;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Registration failed');
  }
});

export const loginUserThunk = createAsyncThunk<
  TAuthResponse,
  TLoginData,
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(data);
    const rawAccess = res.accessToken ?? '';
    const accessToken =
      typeof rawAccess === 'string'
        ? rawAccess.replace(/^Bearer\s+/i, '')
        : rawAccess;
    const refreshToken = res.refreshToken ?? '';

    if (accessToken) setCookie('accessToken', `Bearer ${accessToken}`);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

    return res;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Login failed');
  }
});

export const fetchUserThunk = createAsyncThunk<
  TUserResponse,
  void,
  { rejectValue: string }
>('user/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await getUserApi();
    return res;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Fetch user failed');
  }
});

export const updateUserThunk = createAsyncThunk<
  TUserResponse,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (userPartialData, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(userPartialData);
    return res;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Update user failed');
  }
});

export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('user/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Logout failed');
  }
});
