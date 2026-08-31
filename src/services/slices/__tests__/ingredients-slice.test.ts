import reducer from '../ingredients-slice';
import { fetchIngredients } from '../../thunks/ingredients-thunks';

describe('ingredientsSlice', () => {
  const mockIngredients = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 100,
      image: 'image.jpg',
      image_mobile: 'image-mobile.jpg',
      image_large: 'image-large.jpg'
    }
  ];

  it('should return initial state for unknown action', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  it('should handle fetchIngredients.pending', () => {
    const state = reducer(
      undefined,
      fetchIngredients.pending('requestId', undefined)
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const state = reducer(
      undefined,
      fetchIngredients.fulfilled(mockIngredients, 'requestId', undefined)
    );

    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  it('should handle fetchIngredients.rejected', () => {
    const state = reducer(
      undefined,
      fetchIngredients.rejected(
        new Error('Request failed'),
        'requestId',
        undefined,
        'Ошибка загрузки ингредиентов'
      )
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка загрузки ингредиентов'
    });
  });
});
