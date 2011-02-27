console.log('Configuring Concert unit testing...');
var ConcertTest = require('./ConcertTest.js');
console.log('Testing login...');
ConcertTest.loginTest(function() {
    console.log('Testing settings page...');
    ConcertTest.settingsTest(function() {
        console.log('Everything is peachy.');        
    });
});

