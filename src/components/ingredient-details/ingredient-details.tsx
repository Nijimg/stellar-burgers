import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredient = useAppSelector((s) =>
    s.ingredients.ingredients.find((i) => i._id === id)
  );

  return ingredient ? (
    <IngredientDetailsUI ingredientData={ingredient} />
  ) : (
    <Preloader />
  );
};
