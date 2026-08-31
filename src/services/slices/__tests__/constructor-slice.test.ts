import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructor-slice';

describe('constructorSlice', () => {
  const bun = {
    _id: 'bun-1',
    name: 'Булка',
    type: 'bun' as const,
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 100,
    image: 'image.jpg',
    image_mobile: 'image-mobile.jpg',
    image_large: 'image-large.jpg',
    id: 'constructor-bun-1'
  };

  const ingredient = {
    _id: 'ingredient-1',
    name: 'Начинка',
    type: 'main' as const,
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 200,
    image: 'image.jpg',
    image_mobile: 'image-mobile.jpg',
    image_large: 'image-large.jpg',
    id: 'constructor-ingredient-1'
  };

  it('should return initial state for unknown action', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('should add bun', () => {
    const action = addIngredient(bun);

    const state = reducer(undefined, action);

    expect(state.bun).toEqual({
      ...bun,
      id: expect.any(String)
    });
    expect(state.ingredients).toEqual([]);
  });

  it('should add ingredient', () => {
    const action = addIngredient(ingredient);

    const state = reducer(undefined, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...ingredient,
      id: expect.any(String)
    });
  });

  it('should remove ingredient', () => {
    const initialState = {
      bun: null,
      ingredients: [ingredient]
    };

    const state = reducer(
      initialState,
      removeIngredient({ id: ingredient.id })
    );

    expect(state.ingredients).toEqual([]);
  });

  it('should move ingredient', () => {
    const ingredient1 = {
      ...ingredient,
      id: '1'
    };

    const ingredient2 = {
      ...ingredient,
      id: '2'
    };

    const initialState = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };

    const state = reducer(
      initialState,
      moveIngredient({
        fromIndex: 0,
        toIndex: 1
      })
    );

    expect(state.ingredients).toEqual([ingredient2, ingredient1]);
  });

  it('should not move ingredient with invalid indexes', () => {
    const initialState = {
      bun: null,
      ingredients: [ingredient]
    };

    const state = reducer(
      initialState,
      moveIngredient({
        fromIndex: -1,
        toIndex: 1
      })
    );

    expect(state.ingredients).toEqual([ingredient]);
  });

  it('should clear constructor', () => {
    const initialState = {
      bun,
      ingredients: [ingredient]
    };

    const state = reducer(initialState, clearConstructor());

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
