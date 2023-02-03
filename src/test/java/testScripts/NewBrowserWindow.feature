Feature: In this feature file will be working with new browser window 

Background:
    * configure driver = { type: 'chrome', showDriverLog: true}

Scenario: Testing new browser window 


Given driver 'https://the-internet.herokuapp.com/windows'
* driver.maximize()
* delay(1000)
When click("//a[.='Click Here']")
* delay(1000)
* switchPage('New Window')
* delay(2000)
* switchPage('The Internet')
* delay(2000)
* switchPage(1)
* delay(2000)
* switchPage(0)
* delay(2000)





