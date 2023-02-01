Feature: In this feature file will be using the browser method 

Background:
    * configure driver = { type: 'chrome', showDriverLog: true}

Scenario: Testing the Browser methods


Given driver 'https://www.saucedemo.com/'
* driver.maximize()
* delay(1000)
* driver.refresh()
* delay(1000)
* driver.url = 'https://www.google.com'
* delay(1000)
* driver.back()
* driver.reload()
* delay(1000)
* driver.forward()
* driver.minimize()
* driver.fullscreen()
* delay(1000)
* driver.url = 'https://www.gmail.com'
* delay(1000)
* driver.quit()
