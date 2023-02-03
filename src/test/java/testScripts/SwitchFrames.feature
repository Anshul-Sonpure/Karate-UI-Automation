Feature: In this Feature we will be interacting with frames

Scenario: Interacting with Iframes

Given driver 'https://the-internet.herokuapp.com/iframe'
* configure driver = {type: 'chrome'}
* driver.maximize()
* delay(2000)
And switchFrame("//iframe[@title='Rich Text Area']")
* delay(5000)
And click("//p[.='Your content goes here.']")
* delay(5000)
And input("//p[.='Your content goes here.']",'Hello World')
* delay(5000)