import {test, expect} from '@playwright/test'


test.beforeEach(async({page}) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
})

test('auto waiting', async({page}) => {
    const succesButton = page.locator('.bg-success')

    //await succesButton.click()

    //const text = await succesButton.textContent()
    //await succesButton.waitFor({state: "attached"})
    //const text = await succesButton.allTextContents()

   // expect(text).toContain('Data loaded with AJAX get request.')

    await expect(succesButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
}) 