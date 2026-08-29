import { test, expect } from '@playwright/test';

    const bun = {
    _id: 'bun-1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: 'test-bun.jpg',
    image_large: 'test-bun-large.jpg',
    image_mobile: 'test-bun-mobile.jpg'
    };

    const ingredient = {
    _id: 'ingredient-1',
    name: 'Тестовая начинка',
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 50,
    image: 'test-ingredient.jpg',
    image_large: 'test-ingredient-large.jpg',
    image_mobile: 'test-ingredient-mobile.jpg'
    };

test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/constructor.har', {
        url: '**/ingredients',
        notFound: 'abort'
    });
});
    test.describe('Конструктор бургера', () => {
    test('пользователь может добавить булку в конструктор', async ({ page }) => {
        
        await page.goto('/');

        const bunCard = page
        .getByText(bun.name)
        .first()
        .locator('xpath=ancestor::li');

        await expect(bunCard).toBeVisible();

        await bunCard
        .getByRole('button', { name: 'Добавить' })
        .click();

        await expect(
        page.getByText(`${bun.name} (верх)`)
        ).toBeVisible();

        await expect(
        page.getByText(`${bun.name} (низ)`)
        ).toBeVisible();
    });

    test('пользователь может добавить начинку в конструктор', async ({
        page
    }) => {
        await page.goto('/');

        const ingredientCard = page
        .getByText(ingredient.name)
        .first()
        .locator('xpath=ancestor::li');

        await expect(ingredientCard).toBeVisible();

        await ingredientCard
        .getByRole('button', { name: 'Добавить' })
        .click();
        await expect(page.getByText(ingredient.name).last()).toBeVisible();
    });

    test('пользователь может открыть модалку ингредиента', async ({ page }) => {
    await page.goto('/');

    const ingredientCard = page
        .getByText(ingredient.name)
        .first()
        .locator('xpath=ancestor::li');

    await ingredientCard.getByText(ingredient.name).click();

    await expect(page).toHaveURL(/\/ingredients\/ingredient-1/);

    await expect(
        page.getByRole('heading', { name: 'Ингредиенты' })
    ).toBeVisible();

    await expect(page.getByRole('heading', { name: ingredient.name })).toBeVisible();
});
    

    test('модалка ингредиента закрывается по крестику', async ({ page }) => {
        await page.goto('/');

        const ingredientCard = page
        .getByText(ingredient.name)
        .first()
        .locator('xpath=ancestor::li');

        await ingredientCard
        .getByText(ingredient.name)
        .click();

        await expect(page).toHaveURL(/\/ingredients\/ingredient-1/);

        await expect(
        page.getByRole('heading', { name: 'Ингредиенты' })
        ).toBeVisible();

        await page.getByTestId('modal-close').click();

        await expect(page).toHaveURL('/');
    });

    test('модалка ингредиента закрывается по оверлею', async ({ page }) => {
        await page.goto('/');

        const ingredientCard = page
        .getByText(ingredient.name)
        .first()
        .locator('xpath=ancestor::li');

        await ingredientCard
        .getByText(ingredient.name)
        .click();

        await expect(page).toHaveURL(/\/ingredients\/ingredient-1/);

        await expect(
        page.getByRole('heading', { name: 'Ингредиенты' })
        ).toBeVisible();

        await page.getByTestId('modal-overlay').click({
        position: { x: 10, y: 10 }
        });

        await expect(page).toHaveURL('/');
    });
    });

    test.describe('Оформление заказа', () => {
    test(
        'неавторизованный пользователь перенаправляется на страницу входа при оформлении заказа',
        async ({ page }) => {
        await page.goto('/');

        const bunCard = page
            .getByText(bun.name)
            .first()
            .locator('xpath=ancestor::li');

        await bunCard
            .getByRole('button', { name: 'Добавить' })
            .click();

        await page
            .getByRole('button', { name: 'Оформить заказ' })
            .click();

        await expect(page).toHaveURL(/\/login/);
        }
    );

    test(
        'авторизованный пользователь может оформить заказ',
        async ({ page }) => {
        await page.route('**/auth/user', async (route) => {
            await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                success: true,
                user: {
                email: 'test@test.ru',
                name: 'Тестовый пользователь'
                }
            })
            });
        });

        await page.route('**/orders', async (route) => {
            if (route.request().method() === 'POST') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                success: true,
                name: 'Тестовый бургер',
                order: {
                    _id: 'order-1',
                    number: 12345,
                    status: 'created',
                    name: 'Тестовый бургер',
                    createdAt: '2026-08-27T00:00:00.000Z',
                    updatedAt: '2026-08-27T00:00:00.000Z',
                    ingredients: ['bun-1', 'ingredient-1', 'bun-1']
                }
                })
            });
            }
        });

        await page.addInitScript(() => {
            localStorage.setItem('refreshToken', 'test-refresh-token');
        });
        await page.context().addCookies([
        {
            name: 'accessToken',
            value: 'test-access-token',
            domain: 'localhost',
            path: '/'
        }
        ]);

        await page.goto('/');

        const bunCard = page
            .getByText(bun.name)
            .first()
            .locator('xpath=ancestor::li');

        await bunCard
    .getByRole('button', { name: 'Добавить' })
    .click();

    const ingredientCard = page
        .getByText(ingredient.name)
        .first()
        .locator('xpath=ancestor::li');

    await ingredientCard
        .getByRole('button', { name: 'Добавить' })
        .click();

    await page
        .getByRole('button', { name: 'Оформить заказ' })
        .click();

        await expect(page.getByText('12345')).toBeVisible();
        await expect(
        page.getByText(`${bun.name} (верх)`)
        ).not.toBeVisible();

        await expect(
        page.getByText(`${bun.name} (низ)`)
        ).not.toBeVisible();

        await page.getByTestId('modal-close').click();

        await expect(page.getByText('12345')).not.toBeVisible();
        }
    );
});