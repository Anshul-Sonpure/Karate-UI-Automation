Feature: In this feature file will be working with alerts

Background:
    * configure driver = { type: 'chrome'}

Scenario: Testing the Alerts

Given driver 'https://the-internet.herokuapp.com/javascript_alerts'
* driver.maximize()
* delay(1500)
And click("//button[.='Click for JS Alert']")
* delay(1500)
* dialog(true)
* delay(1500)
And click("//button[.='Click for JS Confirm']")
* delay(1500)
* dialog(false)
And click("//button[.='Click for JS Prompt']")
* delay(3500)
* dialog(true,'I accept')
* delay(3500)

