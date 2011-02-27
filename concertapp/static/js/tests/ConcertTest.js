/**
 *  @file       ConcertTest.js
 *  Contains tests for all pages
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
(function(){

  // Initial Setup
  // -------------
  
  var zombie = require('zombie');
  var assert = require('assert');
  
  var ConcertTest = {};
  if (typeof exports !== 'undefined') {
      ConcertTest = exports;
  } else {
      ConcertTest = this.ConcertTest = {};
  }
  
  
  /* Grab settings */
  ConcertTest.settings = require('./ConcertTestSettings');
  
  ConcertTest.browser = new zombie.Browser({debug: ConcertTest.settings.debug});
  

  /**
   *    This is a helper function for test results.
   **/
  ConcertTest.callbackHelper = function(callback) {
      return function(err, browser, status) {
          if(err) {
              throw new Error(err.message);
          }
          else {
              callback(browser);
          }
      }
  };
  
  /**
   *    Test logging in.
   **/
  ConcertTest.loginTest = function(callback) {
      /* Load index page */
      this.browser.visit(this.settings.baseUrl, function(callback) {
          return ConcertTest.callbackHelper(function(browser) {
              var settings = ConcertTest.settings;
              /* Login as administrator */
              browser.
                fill('username', settings.userOne.username).
                fill('password', settings.userOne.password).
                pressButton('Login', function(callback) {
                    return ConcertTest.callbackHelper(function(browser) {
                        var loc = browser.location.toString();
                        var shouldBeLoc = ConcertTest.settings.baseUrl+'/dashboard/';
                        /* Make sure login worked */
                        assert.equal(loc, shouldBeLoc);
                        
                        /* Everything is peachy */
                        callback();
                    });
                }(callback));
          }); 
      }(callback));
  };
  
  /**
   *    Tests for settings page.
   **/
  ConcertTest.settingsTest = function(callback) {
      
      this.callback = callback;
      
      /* Go to settings page */
      this.browser.visit(this.settings.baseUrl+'/collections/', ConcertTest.callbackHelper(function(browser) {
        /* Make sure we're on settings page.*/
        var loc = browser.location.toString();
        var shouldBeLoc = ConcertTest.settings.baseUrl+'/collections/';
        assert.equal(loc, shouldBeLoc);

        var create_join_input = browser.querySelector('#create_join_input');
        /* Create a new collection */
        browser.
            /* enter new collection name */
            fill('#create_join_input', ConcertTest.settings.newCollectionName);
            try {
                browser.fire('keydown', create_join_input, ConcertTest.callbackHelper(function(browser) {
                //browser.wait(ConcertTest.callbackHelper(function(browser) {
                    //browser.
                    /* Click on 'create new' button */
                    //clickLink('#create_new_collection', ConcertTest.callbackHelper(function(browser) {

                        /* Now our collection object should be in seenInstances */
                        //var collectionModelInstance = browser.evaluate('com.concertsoundorganizer.modelManager.seenInstances[\'Collection\'].last()');

                        //assert.equal(collectionModelInstance.get('name'), ConcertTest.settings.newCollectionName);


                        ConcertTest.callback();
                    //}));
                //}));
                }));
            }
            catch(error) {
                console.log('caught');
                console.log('error:');
                console.log(error);
            }
                    
        
            
    }));
  }
  


}).call(this);
