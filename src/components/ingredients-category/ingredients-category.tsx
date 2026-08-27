import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { selectConstructor } from '@slices';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, ingredients: constructorIngredients } =
    useAppSelector(selectConstructor);

  const counters = useMemo(() => {
    const count: Record<string, number> = {};
    constructorIngredients.forEach(
      (i) => (count[i._id] = (count[i._id] || 0) + 1)
    );
    if (bun) count[bun._id] = 2;
    return count;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={counters}
      ref={ref}
    />
  );
});
