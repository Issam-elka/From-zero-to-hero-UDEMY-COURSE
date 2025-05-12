import {test, expect} from '@playwright/test'

test('Login page', async({page}) => {
    await page.goto("https://freelance-learn-automation.vercel.app/login")

    await page.getByPlaceholder("Enter Email").fill('admin@admin.com')

    await page.getByPlaceholder("Enter Password").fill("admin@123")

    await page.getByRole('button', {name : 'Sign in'}).click()

    await page.getByAltText('menu').click()

    await page.getByText("Practise").click()
})