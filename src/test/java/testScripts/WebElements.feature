Feature: In this Feature we will be interacting with the Web Elements

Background:
    * configure driver = { type: 'chrome', showDriverLog: true}

Scenario: Interacting with the Web Elements

Given driver 'https://parabank.parasoft.com/parabank/index.htm'
* driver.maximize()
* delay(1500)
And input('input[name=username]','admin543212')
* delay(1500)
* clear('input[name=username]')
* delay(1500)
And input('input[name=password]','admin543123')
* delay(1500)
* clear('input[name=password]')
* delay(1500)
And input('input[name=username]','admin543')
* delay(1500)
And input('input[name=password]','admin543')
* delay(1500)
Then submit().click('input[type=submit]')
* delay(1500)
* driver.quit()
