(function(global) {
  'use strict';
  uwl.controller('LandingController', [ '$rootScope', '$scope', '$http','comms','$location', function($rootScope, $scope, $http,comms,$location) {
    /* Properties */
    
    
    /* set watch for ng-include */
    $rootScope.secondView = 'pages/login.html';
    $scope.$watch(function () {
      return $rootScope.secondView;
  }, function (newValue, oldValue) {
      $scope.includeView = newValue;
  });
    
    /* navigation menu variables */
    $rootScope.navmenu = 'pages/navMenu.html';
    $rootScope.menuEnabled = false;
    
    resetErrors(this);
    
    
    this.newCustomer = {};
    this.newCustomer.owns = [];
    this.oldCustomer = {};
    this.oldCustomer.owns = [];
    
    
    
    /* TODO remove all this section this later */
/*
    $rootScope.secondView = 'inDevelopment/store_template.html';

    this.newCustomer.username = "TestName";
    this.newCustomer.email = "Test@mail.com";
    this.newCustomer.street = "Galil";
    this.newCustomer.blockNum = 12;
    this.newCustomer.city = "Haifa";
    this.newCustomer.zip = 1234567;
    this.newCustomer.phone = '046-222-210';
    this.newCustomer.password = "123";
    this.newCustomer.password2 = "123";
    this.newCustomer.nickname = "Megapihar";
    this.newCustomer.description = "Desc";
    this.newCustomer.photo = "http://www.goolag.com";
*/
    /* END OF SECTION TO BE REMOVED */

    /* set controller variables */

    /* login variables */
    this.wrongLoginData = false;

    /* Register variables */
    var fieldEmpty = "This is a reqired field";
    var usernameError = "Username must be unique, can have only English characters and numbers and can't be longer than 10 characters";
    var emailerror = "Please provide a valid email, that has @ character and a domain dot";
    var streetError = "Address must contain English characters only, and be longer than 3 characters";
    var blockError = "Block number has to be a number and can't be empty";
    var cityError = "City name must contain English characters only, and be longer than 3 characters";
    var zipError = "ZIP has to be exactly seven numbers";
    var phoneError = "Phone number must be valid, for example 0545-333-22-11 or 046-222-210";
    var passError = "Password can be at most 8 characters and can't be empty";
    var pass2Error = "Passwords don't match";
    var nickError = "Nickname must be unique and up to 20 characters";
    var photoError = "Not recognized as valid URL";

    this.usernameError = "Username must be unique, can have only English characters and numbers and can't be longer than 10 characters";
    this.emailerror = "Please provide a valid email, that has @ character and a domain dot";
    this.streetError = "Address must contain English characters only, and be longer than 3 characters";
    this.blockError = "Block number has to be a number and can't be empty";
    this.cityError = "City name must contain English characters only, and be longer than 3 characters";
    this.zipError = "ZIP has to be exactly seven numbers";
    this.phoneError = "Phone number must be valid, for example 0545-333-22-11 or 046-222-210";
    this.passError = "Password can be at most 8 characters and can't be empty";
    this.pass2Error = "Passwords don't match";
    this.nickError = "Nickname must be unique and up to 20 characters";
    this.descError = "No more than 50 characters please";
    this.photoError = "Not recognized as valid URL";

    /* Functions */

    /* navigarion menu toggle */
    this.menutoggle = function(){
      $rootScope.menuEnabled = $rootScope.menuEnabled == true ? false : true;
      $rootScope.$apply;
    }
    
    this.navToRegister = function() {
      $rootScope.secondView='pages/registration.html'
    };

    this.navToLogin = function() {
      $rootScope.secondView='pages/login.html'
    };

    this.navToStore = function(){
      $rootScope.secondView='pages/store.html';
      $('#btnStore').removeClass().addClass('btn navbar-btn');
      $('#btnMyBooks').removeClass().addClass('btn navbar-btn btn-default');
    }
    
    this.navToMyBooks = function(){
      $rootScope.secondView='pages/myBooks.html';
      $('#btnMyBooks').removeClass().addClass('btn navbar-btn');
      $('#btnStore').removeClass().addClass('btn navbar-btn btn-default');
    }
    
    this.login = function() {
      if (!this.oldCustomer.username || !this.oldCustomer.password || this.oldCustomer.username.length <= 0 || this.oldCustomer.password.length <= 0) {
        this.wrongLoginData = true;
        this.wrongLoginMessage = "These fields cannot be empty";
      }
      else if (!testOldUsername(this.oldCustomer.username) || !testNewPassword(this.oldCustomer.password)) {
        this.wrongLoginData = true;
        this.wrongLoginMessage = "Please recheck your input";
      }
      else {
        this.wrongLoginData = false;
        var ctr=this;
        comms.call('POST', '/LogInServlet', this.oldCustomer, 
          function(data, textStatus, jqXHR) {
          if(data.result == "fail"){
            alert(data.result);
            ctr.wrongLoginData = true;
            ctr.wrongLoginMessage = "Incorrect credentials";
            }
          else {
            $rootScope.user=data.customer;
            ctr.menutoggle();
            ctr.navToStore();
          }
            $rootScope.$apply();
          }, function(data, textStatus, errorThrown) {
          alert('Server error. Please try again');
        }, null);
        
      }
    };

    /** Register new user */
    this.register = function() {
      resetErrors(this);

      /* Input check */
      var passed = true;
      /* Test Username */
      if (this.newCustomer.username == undefined) {
        this.usernameError = fieldEmpty;
        passed = false;
        this.newUserNameOk = false;
      }
      else if (!testNewUsername(this.newCustomer.username)) {
        this.usernameError = usernameError;
        passed = false;
        this.newUserNameOk = false;
      }

      /* Test email */
      if (this.newCustomer.email == undefined) {
        this.emailerror = fieldEmpty;
        passed = false;
        this.newEmailOk = false;
      }
      else if (!testNewEmail(this.newCustomer.email)) {
        this.emailerror = emailerror;
        passed = false;
        this.newEmailOk = false;
      }

      /* Test Street name */
      if (this.newCustomer.street == undefined) {
        this.streetError = fieldEmpty;
        passed = false;
        this.newStreetOk = false;
      }
      else if (!testNewStreet(this.newCustomer.street)) {
        this.streetError = streetError;
        passed = false;
        this.newStreetOk = false;
      }

      /* Test block number */
      if (this.newCustomer.blockNum == undefined) {
        this.blockError = fieldEmpty;
        passed = false;
        this.newBlockNumberOk = false;
      }
      else if (!testNewBNum(this.newCustomer.blockNum)) {
        this.blockError = blockError;
        passed = false;
        this.newBlockNumberOk = false;
      }

      /* Test City */
      if (this.newCustomer.city == undefined) {
        this.cityError = fieldEmpty;
        passed = false;
        this.newCityOk = false;
      }
      else if (!testNewStreet(this.newCustomer.city)) {
        this.cityError = cityError;
        passed = false;
        this.newCityOk = false;
      }

      /* Test ZIP */
      if (this.newCustomer.zip == undefined) {
        this.zipError = fieldEmpty;
        passed = false;
        this.newZIPOk = false;
      }
      else if (!testNewZip(this.newCustomer.zip)) {
        this.zipError = zipError;
        passed = false;
        this.newZIPOk = false;
      }

      /* Test Phone */
      if (this.newCustomer.phone == undefined) {
        this.phoneError = fieldEmpty;
        passed = false;
        this.newPhoneOk = false;
      }
      else if (!testNewPhone(this.newCustomer.phone)) {
        this.phoneError = phoneError;
        passed = false;
        this.newPhoneOk = false;
      }
      else {
        this.newCustomer.phone = reformatPhone(this.newCustomer.phone);
      }

      /* Test Password */
      if (this.newCustomer.password == undefined) {
        this.passError = fieldEmpty;
        passed = false;
        this.newPassOk = false;
      }
      else if (!testNewPassword(this.newCustomer.password)) {
        this.passError = passError;
        passed = false;
        this.newPassOk = false;
      }
      else
      /* Test repeat password */
      if (this.newCustomer.password2 == undefined) {
        this.pass2Error = fieldEmpty;
        passed = false;
        this.newPass2Ok = false;
      }
      else if (this.newCustomer.password2 != this.newCustomer.password) {
        this.pass2Error = pass2Error;
        passed = false;
        this.newPass2Ok = false;
      }

      /* Test Nickname */
      if (this.newCustomer.nickname == undefined) {
        this.nickError = fieldEmpty;
        passed = false;
        this.newNickOk = false;
      }
      else if (!testNewNick(this.newCustomer.nickname)) {
        this.nickError = nickError;
        passed = false;
        this.newNickOk = false;
      }

      /* Test Description */
      if (this.newCustomer.description != undefined && !testNewDescription(this.newCustomer.description)) {
        passed = false;
        this.newDescOk = false;
      }

      /* Test photo */
      if (this.newCustomer.photo != undefined && !testNewPhoto(this.newCustomer.photo)) {
        passed = false;
        this.newPhotoOk = false;
      }
      var myC = this;
      if (passed == true) {
        /* send this.newCustomer to server */
        /*alert('user passed all the tests - attempting to send the post request');*/
        comms.call('POST', 'UserServlet', this.newCustomer,
           function(data, textStatus, jqXHR) {
          myC.navToLogin();
          myC.newCustomer = {};
          myC.registrationSuccessful = true;
          $rootScope.$apply();
        } ,
          function(data,textStatus, errorThrown) {
          alert('Server error. Please try again');
          $('.debug2').text($('.debug2').text() + errorThrown);
        } ,null);
      }
    }; // this.register
    
    
  } ]).controller('LibController',['$rootScope', '$scope', '$http','comms', function($rootScope, $scope, $http,comms) {
    $rootScope.products = [];
    var us = $rootScope.user;
    us.owns2 = [];
    //listProperties(us);
    if(us.owns.length != 0)
      {
      us.owns.forEach(function(el){
        us.owns2.push(el.bid);
      }); // forEach owns
      //$rootScope.user.owns2
      } // if
    comms.sync('/GetBookList', null,
        function(data, textStatus, jqXHR)
        {
          data.forEach(function(item){$scope.products.push(item);});
          $scope.products.forEach(function(el){
            var alllikes = "<ul class=\"list-unstyled text-info\">";
            el.likescount = el.likes.length;
            if (el.likes.length != 0){
            el.likes.forEach(function(li) {
              alllikes = alllikes + "<li>" + li + "</li>";
            }); // foreach
            }   // if
            alllikes = alllikes + "</ul>"
            el.likesstring = alllikes;
            el.reviewCount = el.reviews.length;
          }); // forEach product
          $scope.$apply();
        }, function(data, textStatus, errorThrown) {
        alert('Server error. Please try again');
        $('#debug2').text($('#debug2').text() + errorThrown);
      },null); // comms.sync
      
    /* klutch - wait for async to complete */
      $scope.refreshme = function(){
        $('.mypop').popover();
      $scope.products.forEach(function(el) {
        /* if there are zero likes, dim the button and disable popover */
        if (el.likescount == 0) {
          $('#btnLike' + el.bid).addClass('disabled').popover('destroy');
        }
        /* if there are zero reviews - disable button */
        if (el.likescount == 0) {
          $('#btnRev' + el.bid).addClass('disabled');
        }
        /* if user owns the book - hide purchase button, else hide read button */
        if (us.owns2.length == 0 || !us.owns2.includes(el.bid)) {
          $('#btnRead' + el.bid).remove();
        }
        else {
          $('#btnBuy' + el.bid).remove();
        }
      });// forEach products
      }; // refresh function
      
      $scope.$watch(function () {
        return $scope.searchBook;
    }, function (newValue, oldValue) {
      setTimeout(function(){
        $('.mypop').popover();
        $scope.products.forEach(function(el) {
          /* if there are zero likes, dim the button and disable popover */
          if (el.likescount == 0) {
            $('#btnLike' + el.bid).addClass('disabled').popover('destroy');
          }
          /* if there are zero reviews - disable button */
          if (el.likescount == 0) {
            $('#btnRev' + el.bid).addClass('disabled');
          }
          /* if user owns the book - hide purchase button, else hide read button */
          if (us.owns2.length == 0 || !us.owns2.includes(el.bid)) {
            $('#btnRead' + el.bid).remove();
          }
          else {
            $('#btnBuy' + el.bid).remove();
          }
        });// forEach products
        } // refresh function
          ,50);
    });
      setTimeout(function(){
        $('.mypop').popover();
        $scope.products.forEach(function(el) {
          /* if there are zero likes, dim the button and disable popover */
          if (el.likescount == 0) {
            $('#btnLike' + el.bid).addClass('disabled').popover('destroy');
          }
          /* if there are zero reviews - disable button */
          if (el.likescount == 0) {
            $('#btnRev' + el.bid).addClass('disabled');
          }
          /* if user owns the book - hide purchase button, else hide read button */
          if (us.owns2.length == 0 || !us.owns2.includes(el.bid)) {
            $('#btnRead' + el.bid).remove();
          }
          else {
            $('#btnBuy' + el.bid).remove();
          }
        });// forEach products
        } // refresh function
        ,50); //setTimeout
  }]).controller('booksController',['$rootScope', '$scope', '$http','comms', function($rootScope, $scope, $http,comms) {
    
//    console.log('aa');
    $rootScope.myPr = [];
    var us = $rootScope.user;
    us.owns2 = [];
    if(us.owns.length != 0)
      {
        us.owns.forEach(function(el){
          us.owns2.push(el.bid);
        }); // forEach owns
      } // if
    /* make a list of my books */
    $scope.products.forEach(function(el) {
      if (us.owns2.includes(el.bid)) {
        $rootScope.myPr.push(el);
      }
    });
    /* if I have books, for my every book do */
    if ($rootScope.myPr.length != 0) {
      $rootScope.myPr.forEach(function(el) {
        /* build likes popover snippet */
        var alllikes = "<ul class=\"list-unstyled text-info\">";
        el.likescount = el.likes.length;
        if (el.likes.length != 0) {
          el.likes.forEach(function(li) {
            alllikes = alllikes + "<li>" + li + "</li>";
          }); // foreach like
        } // if
        alllikes = alllikes + "</ul>"
        /* put popover code into the object as a property */
        el.likesstring = alllikes;
        /* also count reviews and put as a property */
        el.reviewCount = el.reviews.length;
      }); // forEach product
    }
    

    $scope.$watch(function() {
      return $scope.searchMyBook;
    }, function(newValue, oldValue) {
      setTimeout(function() {
        $('.mypop').popover();
        $scope.products.forEach(function(el) {
          /* if there are zero likes, dim the button and disable popover */
          if (el.likescount == 0) {
            $('#btnLike' + el.bid).addClass('disabled').popover('destroy');
          }
          /* if there are zero reviews - disable button */
          if (el.likescount == 0) {
            $('#btnRev' + el.bid).addClass('disabled');
          }
          /* if user owns the book - hide purchase button, else hide read button */
          if (us.owns2.length == 0 || !us.owns2.includes(el.bid)) {
            $('#btnRead' + el.bid).remove();
          }
          else {
            $('#btnBuy' + el.bid).remove();
          }
        });// forEach products
      } // refresh function
      , 50);
    });

    $('.mypop').popover();
    $scope.products.forEach(function(el) {
      /* if there are zero likes, dim the button and disable popover */
      if (el.likescount == 0) {
        $('#btnLike' + el.bid).addClass('disabled').popover('destroy');
      }
      /* if there are zero reviews - disable button */
      if (el.likescount == 0) {
        $('#btnRev' + el.bid).addClass('disabled');
      }
      /* if user owns the book - hide purchase button, else hide read button */
      if (us.owns2.length == 0 || !us.owns2.includes(el.bid)) {
        $('#btnRead' + el.bid).remove();
      }
      else {
        $('#btnBuy' + el.bid).remove();
      }
    });// forEach products
      
  }]);// controller
})();
