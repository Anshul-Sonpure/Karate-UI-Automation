Feature: Lauching App in chrome browser

Background:
    * configure driver = { type: 'chrome', showDriverLog: true}

Scenario: User must able to login in SauceDemo

Given driver 'https://www.saucedemo.com/'
* driver.maximize()
And input('input[name=user-name]','standard_user')
And input('input[name=password]','secret_sauce')
When click('input[name=login-button]')
* delay(2000)
Then waitForUrl('https://www.saucedemo.com/inventory.html')