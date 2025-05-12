import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200/')
})


test.describe('Form Layouts page', () => {
    test.beforeEach( async({page}) =>{
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    } )

    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
    
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500})


        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test('radio buttons', async({page})=> {
        const usingTheGridEmailForm = page.locator('nb-card', {hasText: "Using the Grid"})

        // await usingTheGridEmailForm.getByLabel('option 1')
        await usingTheGridEmailForm.getByRole('radio', {name: "Option 1"}).check({force: true})
        const radioStatus = await usingTheGridEmailForm.getByRole('radio', {name: "Option 1"}).isChecked()
        expect(radioStatus).toBeTruthy()

        await usingTheGridEmailForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        expect(await usingTheGridEmailForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        expect(await usingTheGridEmailForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    
    })


})

test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', {name: "Hide on click"}).check({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})
    await page.getByRole('checkbox', {name: "Show toast with icon"}).click({force: true})

    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('lists and dropdowns', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select ')
    await dropDownMenu.click()

    page.getByRole('list') //When the list has a UL tag
    page.getByRole('listitem') //When the list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')
    
    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }
    await dropDownMenu.click()
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate")
            await dropDownMenu.click()
    }

})


test('dialog box', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    // await page.locator('.nb-trash').first().click()

    expect(page.locator('table tr').first()).not.toHaveText("mdo@gmail.com")
})

test('web tables', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //1 Get the row by any test in this row
    // const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})

    await page.locator('.ng2-smart-pagination-nav').getByText("2").click()
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText("11")})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@admin.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText("test@admin.com")

    const ages = ["20", "30", "40", "200"]
    
    for ( let age of ages ){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        for (let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent()

            if (age == "200"){

                expect(await page.getByRole('table').textContent()).toContain("No data found")
            }else{
                
                expect(cellValue).toEqual(age)
            }
        }
    }

})


test('datepicker', async({page}) => {

    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField =  page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 1)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedYear = date.getFullYear()
    const dateToAssert = 

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(calendarInputField).toHaveValue('May 9, 2025')
}
)

test('sliders', async({page}) => {

    //Update attributs
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle ')
    // await tempGauge.evaluate( node => {
    //     node.setAttribute('cx', '232.630')
    //     node.setAttribute('cy', '232.630')
    // })
    // await tempGauge.click()


    //Mouse mouvement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempBox.scrollIntoViewIfNeeded()

    await tempBox.boundingBox()
});
