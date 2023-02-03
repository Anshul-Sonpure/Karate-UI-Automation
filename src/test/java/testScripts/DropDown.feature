Feature: In this feature file will be working with drop down 

Background:
    * configure driver = { type: 'chrome', showDriverLog: true}

Scenario: Testing the Drop Down 


Given driver 'https://omayo.blogspot.com/'
* driver.maximize()
* delay(1000)
# select by displayed text
And select("//*[@name='SiteMap']", '{}doc 1')
* delay(2000)
# select by partial displayed text
And select("//*[@name='SiteMap']", '{^}doc 2')
* delay(2000)
# select by `value`
And select("//*[@name='SiteMap']", 'jkl')
* delay(2000)
# select by index
* delay(5000)
And select("//*[@name='SiteMap']", 4)
* delay(5000)