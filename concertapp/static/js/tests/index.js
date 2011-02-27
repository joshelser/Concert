var zombie = require('zombie');
var assert = require('assert');

var baseUrl = 'http://localhost:8896';
var userOne = {
    username: 'colin', 
    password: 'colin'
};
var userTwo = {
    username: 'amy', 
    password: 'amy'
};

console.log('Starting tests...');
/* Load index page */
zombie.visit(baseUrl, function(err, browser, status) {
    /* Login as administrator */
    browser.
        fill('username', userOne.username).
        fill('password', userOne.password).
        pressButton('Login', function(err, browser, status) {
            assert.equal(browser.location.toString(), baseUrl+'/dashboard/');
        });
});

console.log('All tests completed successfully.');