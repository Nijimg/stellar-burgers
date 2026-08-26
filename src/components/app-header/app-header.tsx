import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { selectUser } from '@slices';
import { useAppSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const userName = useAppSelector(selectUser)?.name ?? '';

  return <AppHeaderUI userName={userName} />;
};
