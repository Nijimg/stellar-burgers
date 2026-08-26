import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { selectUserError, selectUserLoading } from '@slices';
import { loginUserThunk } from '@thunks';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  const error = useAppSelector(selectUserError);
  const isLoading = useAppSelector(selectUserLoading);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await dispatch(loginUserThunk({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
