(function(global) {
  'use strict';
  uwl.controller('LandingController', [ '$rootScope', '$scope', '$http', 'comms', '$location', function($rootScope, $scope, $http, comms, $location) {
    /* Properties */
    $rootScope.raceCond = 200;

    /* set watch for ng-include */
    $rootScope.secondView = 'pages/login.html';
    $scope.$watch(function() {
      return $rootScope.secondView;
    }, function(newValue, oldValue) {
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
     * $rootScope.secondView = 'pages/checkout.html';
     * 
     * 
     * 
     * this.newCustomer.username = "TestName"; this.newCustomer.email = "Test@mail.com"; this.newCustomer.street = "Galil"; this.newCustomer.blockNum =
     * 12; this.newCustomer.city = "Haifa"; this.newCustomer.zip = 1234567; this.newCustomer.phone = '046-222-210'; this.newCustomer.password = "123";
     * this.newCustomer.password2 = "123"; this.newCustomer.nickname = "Megapihar"; this.newCustomer.description = "Desc"; this.newCustomer.photo =
     * "http://www.goolag.com";
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
    this.menutoggle = function() {
      $rootScope.menuEnabled = $rootScope.menuEnabled == true ? false : true;
      $rootScope.$apply;
    }

    this.navToRegister = function() {
      $rootScope.secondView = 'pages/registration.html'
    };

    this.navToLogin = function() {
      $rootScope.secondView = 'pages/login.html'
    };

    this.navToStore = function() {
      $rootScope.secondView = 'pages/store.html';
      $('#btnStore').removeClass().addClass('btn navbar-btn btn-default active');
      $('#btnMyBooks').removeClass().addClass('btn navbar-btn btn-default');
    }

    this.navToMyBooks = function() {
      $rootScope.secondView = 'pages/myBooks.html';
      $('#btnMyBooks').removeClass().addClass('btn navbar-btn btn-default active');
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
        var ctr = this;
        comms.call('POST', '/LogInServlet', this.oldCustomer, function(data, textStatus, jqXHR) {
          if (data.result == "fail") {
            alert(data.result);
            ctr.wrongLoginData = true;
            ctr.wrongLoginMessage = "Incorrect credentials";
          }
          else {
            $rootScope.user = data.customer;
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
      else {
        this.newCustomer.stName = this.newCustomer.street;
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
      else {
        this.newCustomer.blNum = this.newCustomer.blockNum;
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
      else {
        this.newCustomer.cityName = this.newCustomer.city;
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
      else {
        this.newCustomer.zip = this.newCustomer.zip.toString();
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
        /* alert('user passed all the tests - attempting to send the post request'); */
        comms.call('POST', 'UserServlet', this.newCustomer, function(data, textStatus, jqXHR) {
          myC.navToLogin();
          myC.newCustomer = {};
          myC.registrationSuccessful = true;
          $rootScope.$apply();
        }, function(data, textStatus, errorThrown) {
          alert('Server error. Please try again');
          $('.debug2').text($('.debug2').text() + errorThrown);
        }, null);
      }
    }; // this.register

    $rootScope.myBooksFilter = function(subbstr) {
      return function(book) {
        console.log(subbstr);
        if (typeof subbstr !== "undefined" && subbstr !== null) {
          if (subbstr.length == 0) return book;
          var nam = book.name.toLowerCase();
          var auth = book.author.toLowerCase();
          var subs = subbstr.toLowerCase();
          if (nam.includes(subs) || auth.includes(subs)) {
            return book;
          }
        }
        else {
          return book;
        }
      };
    };  
    
    
  } ]).controller('LibController', [ '$rootScope', '$scope', '$http', 'comms', function($rootScope, $scope, $http, comms) {
    $rootScope.products = [];
    var us = $rootScope.user;
    console.log($rootScope.user);
    us.owns2 = [];
    // listProperties(us);
    if (us.owns.length != 0) {
      us.owns.forEach(function(el) {
        us.owns2.push(el.bid);
      }); // forEach owns
      // $rootScope.user.owns2
    } // if
    comms.sync('/GetBookList', null, function(data, textStatus, jqXHR) {
      data.books.forEach(function(item) {
        $scope.products.push(item);
      });
      $scope.products.forEach(function(el) {
        var alllikes = "<ul class=\"list-unstyled text-info\">";
        el.likescount = el.likes.length;
        if (el.likes.length != 0) {
          el.likes.forEach(function(li) {
            alllikes = alllikes + "<li>" + li + "</li>";
          }); // foreach
        } // if
        alllikes = alllikes + "</ul>"
        el.likesstring = alllikes;
        el.reviewCount = el.reviews.length;
      }); // forEach product
      $scope.$apply();
    }, function(data, textStatus, errorThrown) {
      alert('Server error. Please try again');
      $('#debug2').text($('#debug2').text() + errorThrown);
    }, null); // comms.sync

    /* klutch - wait for async to complete */
    $scope.refreshme = function() {
      $('.mypop').popover();
      $scope.products.forEach(function(el) {
        /* if there are zero likes disable popover */
        if (el.likescount == 0) {
          $('#btnLike' + el.bid).popover('destroy');
        }
        /* dim all the buttons */
        $('#btnLike' + el.bid).addClass('disabled');
        /* if there are zero reviews - disable button */
        if (el.reviewCount == 0) {
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

    $scope.$watch(function() {
      return $scope.searchBook;
    }, function(newValue, oldValue) {
      setTimeout(function() {
        $('.mypop').popover();
        $scope.products.forEach(function(el) {
          /* if there are zero likes disable popover */
          if (el.likescount == 0) {
            $('#btnLike' + el.bid).popover('destroy');
          }
          /* dim all the buttons */
          /* $('#btnLike' + el.bid).addClass('disabled'); */
          /* if there are zero reviews - disable button */
          if (el.reviewCount == 0) {
            $('#btnRev' + el.bid).addClass('disabled');
          }
          /* if user owns the book - hide purchase button, else hide read button */
          if (us.owns2.length == 0 || !us.owns2.includes(el.bid)) {
            $('#btnMeBuy' + el.bid).removeClass('hidden');
          }
          else {
            $('#btnMeRead' + el.bid).removeClass('hidden');
          }
        });// forEach products
      } // refresh function
      , $rootScope.raceCond);
    });
    setTimeout(function() {
      $('.mypop').popover();
      $scope.products.forEach(function(el) {
        /* if there are zero likes, dim the button and disable popover */
        if (el.likescount == 0) {
          $('#btnLike' + el.bid).popover('destroy');
        }
        /* dim all the buttons */
        /* $('#btnLike' + el.bid).addClass('disabled'); */
        /* if there are zero reviews - disable button */
        if (el.reviewCount == 0) {
          $('#btnRev' + el.bid).addClass('disabled');
        }
        /* if user owns the book - hide purchase button, else hide read button */
        if (us.owns2.length == 0 || !us.owns2.includes(el.bid)) {
          $('#btnMeBuy' + el.bid).removeClass('hidden');
        }
        else {
          $('#btnMeRead' + el.bid).removeClass('hidden');
        }
      });// forEach products
    } // refresh function
    , 1000); // setTimeout

    /* store function */
    this.navToOpenBook = function(tr) {
      $rootScope.bookToRead = $rootScope.products.find(function(bk) {
        return bk.bid == tr;
      });
      $rootScope.secondView = 'pages/reading.html';
      $('#btnStore').removeClass().addClass('btn navbar-btn btn-default');
      $('#btnMyBooks').removeClass().addClass('btn navbar-btn btn-default');

    };// openBook function

    this.navToBuyBook = function(bookId) {
      // TODO finish this function
      $rootScope.buyBook = bookId;
      $('#btnStore').removeClass().addClass('btn navbar-btn btn-default');
      $('#btnMyBooks').removeClass().addClass('btn navbar-btn btn-default');
      $rootScope.secondView = 'pages/checkout.html';
    };

    $scope.customBookFilter = function(subbstr) {
      return function(book) {
        if (typeof subbstr !== "undefined" && subbstr !== null) {
          if (subbstr.length == 0) return book;
          var nam = book.name.toLowerCase();
          var auth = book.author.toLowerCase();
          var subs = subbstr.toLowerCase();
          if (nam.includes(subs) || auth.includes(subs)) {
            return book;
          }
        }
        else {
          return book;
        }
      };
    };

  } ]).controller('booksController', [ '$rootScope', '$scope', '$http', 'comms', function($rootScope, $scope, $http, comms) {

    // console.log('aa');
    $rootScope.myPr = [];
    var us = $rootScope.user;
    us.owns2 = [];
    if (us.owns.length != 0) {
      us.owns.forEach(function(el) {
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
        $scope.myPr.forEach(function(el) {
          /* if there are zero likes disable popover */
          if (el.likescount == 0) {
            $('#btnLike' + el.bid).popover('destroy');
          }
          /* if there are zero reviews - disable button */
          if (el.reviewCount == 0) {
            $('#btnRev' + el.bid).addClass('disabled');
          }
          /* if user likes the book - activate button */
          if (us.likes.length != 0) {
            if (us.likes.find(function(li) {
              return (li.bid == el.bid);
            })) {
              $('#btnLike' + el.bid).addClass('active');
            }
          }
          /* check if the user has already reviews the book */
          if (us.reviews.find(function(rew) {
            return rew.bid == el.bid;
          })) {
            console.log('review exists');
            /* $('btnMyReview' + el.bid).text('Edit your review'); */
            /* Possibly will make an option to edit reviews */
          }
          else {
            $('#btnMyReview' + el.bid).removeClass('hidden');
          }

        });// forEach products
      } // refresh function
      , $rootScope.raceCond);
    });

    /* myBooks function */
    this.navToOpenBook = function(tr) {
      $rootScope.bookToRead = $rootScope.products.find(function(bk) {
        return bk.bid == tr;
      });
      console.log('got ' + $rootScope.bookToRead.name);
      console.log('filepath is :' + $rootScope.bookToRead.filepath);
      $rootScope.secondView = 'pages/reading.html';
      $('#btnStore').removeClass().addClass('btn navbar-btn btn-default');
      $('#btnMyBooks').removeClass().addClass('btn navbar-btn btn-default');
    };// openBook function

    $('.mypop').popover();
    $scope.myPr.forEach(function(el) {
      /* if there are zero likes disable popover */
      if (el.likescount == 0) {
        $('#btnLike' + el.bid).popover('destroy');
      }
      /* if there are zero reviews - disable button */
      if (el.reviewCount == 0) {
        $('#btnRev' + el.bid).addClass('disabled');
      }
      /* if user likes the book - activate button and change the text */
      if (us.likes.length != 0) {
        if (us.likes.find(function(li) {
          return (li.bid == el.bid);
        })) {
          $('#btnLike' + el.bid).addClass('active').text('Unlike');
        }
      }
      /* check if the user has already reviews the book */
      if (us.reviews.length != 0) if (us.reviews.find(function(rew) {
        return rew.bid == el.bid;
      })) {
        /* $('btnMyReview' + el.bid).text('Edit your review'); */
        /* Possibly will make an option to edit reviews */
      }
      else {
        console.log('enabling review button for ' + el.name);
        $('#btnMyReview' + el.bid).removeClass('hidden');
      }
    });// forEach products

    /* like or unlike a book */
    this.giveLike = function(bookId) {
      if (us.likes.find(function(li) {
        return li.bid == bookId;
      })) {
        // unLike
        var payload = {};
        /* prepare payload for server */
        payload.uid = us.uid;
        payload.bid = bookId;
        /* async call to server */
        comms.call('POST', 'unLike', payload, function(data, textStatus, jqXHR) {
          /* if like was deleted run this */
          /* chance button apperance */
          $('#btnLike' + bookId).removeClass('active');
          /* remove the like from the user likes array */
          var ind = us.likes.findIndex(function(lik) {
            return lik.bid == bookId
          });
          us.likes.splice(ind, 1);

          /* find the book in scope */
          var el = $scope.myPr.find(function(bk) {
            return bk.bid == bookId
          });

          /* delete current user from this book likes */
          var booklikes = el.likes;
          ind = booklikes.findIndex(function(lik) {
            return lik == us.nickname
          });
          booklikes.splice(ind, 1);

          /* rebuild this like popover */
          var alllikes = "<ul class=\"list-unstyled text-info\">";
          el.likescount = el.likes.length;
          if (el.likes.length != 0) {
            el.likes.forEach(function(li) {
              alllikes = alllikes + "<li>" + li + "</li>";
            }); // foreach like
          } // if
          /* disable popover */
          else {
            $('#btnLike' + bookId).popover('destroy');
          }
          alllikes = alllikes + "</ul>"
          /* put popover code into the object as a property */
          el.likesstring = alllikes;
          $scope.$apply();
        }, function(data, textStatus, errorThrown) {
        }, null);
      }
      else {
        // AddLike
        var payload = {};
        /* prepare payload for server */
        payload.uid = us.uid;
        payload.bid = bookId;
        /* async call to server */
        comms.call('POST', 'AddLike', payload, function(data, textStatus, jqXHR) {
          /* if like was added run this */
          /* chance button apperance */
          $('#btnLike' + bookId).addClass('active');
          /* add like to the user likes array */
          var newlike = {
            bid : bookId,
            uid : us.uid
          };
          us.likes.push(newlike);

          /* find the book in scope */
          var el = $scope.myPr.find(function(bk) {
            return bk.bid == bookId
          });

          /* add current user to this book likes */
          var booklikes = el.likes;
          booklikes.push(us.nickname);

          /* rebuild this like popover */
          var alllikes = "<ul class=\"list-unstyled text-info\">";
          el.likescount = el.likes.length;
          if (el.likes.length != 0) {
            el.likes.forEach(function(li) {
              alllikes = alllikes + "<li>" + li + "</li>";
            }); // foreach like
            /* turn on popover */
            $('#btnLike' + bookId).popover();
          } // if
          /* disable popover */
          else {
            $('#btnLike' + bookId).popover('destroy');
          }
          alllikes = alllikes + "</ul>"
          /* put popover code into the object as a property */
          el.likesstring = alllikes;
          $scope.$apply();
        }, function(data, textStatus, errorThrown) {
          console.log(errorThrown);
        }, null);
      } // end else
    }; // end give like

    /* write new review for book */

    $('#composeReview').on('show.bs.modal', function(event) {
      var button = $(event.relatedTarget); // button that triggered the event
      var bookId = button.data('book'); // get book id from the button
      var thbook = $scope.myPr.find(function(bk) {
        return bk.bid == bookId
      });
      var mo = $(this);
      mo.find('.modal-title').text('Compose public review for ' + thbook.name + ' as ' + $scope.user.nickname);
      var btnSubRev = mo.find('.modal-footer #publishReview')[0];
      btnSubRev.setAttribute("data-book", bookId);

    }); // end modal manipulation

    $rootScope.writeReview = function() {
      var btnSubRev = $('#publishReview');
      var bookId = btnSubRev.data('book');
      var payload = {};
      payload.bid = bookId;
      payload.uid = us.uid;
      payload.approved_by = null;
      payload.reviewBody = $('#reviewBody')[0].value;
      comms.sync('/AddReview', payload, function(data, textStatus, jqXHR) {
        console.log(data.result);
        $('#btnMyReview' + bookId).addClass('hidden');
        var rev = {};
        rev.uid = us.uid;
        rev.bid = bookId;
        console.log(us.reviews);
        us.reviews.push(rev);
        console.log(us.reviews);
      }, function(data, textStatus, errorThrown) {
        alert(textStatus + " " + errorThrown);
        console.log(textStatus + " " + errorThrown);
      }, null);
      console.log('Review for book ' + bookId + ' from ' + us.nickname);
      $('#composeReview').modal('hide');
    }

  } ]).controller('checkoutController', [ '$rootScope', '$scope', '$http', 'comms', function($rootScope, $scope, $http, comms) {

    /* testing assignments */
    /*
     * $scope.chn= $scope.chn="abcd"; $scope.strt="abcd"; $scope.zp="1234567"; $scope.city="asdc"; $scope.cntr="abcd";
     * $scope.cardNum="4874587458745874"; $scope.cvv="123";
     */
    /* end of testing assignments */
    $scope.months = [];
    var i = 0;
    var j = "";
    for (i = 1; i < 13; i++) {
      j = i < 10 ? '0' + i.toString() : i.toString();
      $scope.months.push(j);
    }
    $scope.years = [];
    i = new Date();
    j = i.getFullYear();
    for (i = 0; i < 10; i++) {
      $scope.years.push(j + i);
    }

    /* test card holder name */
    this.testchn = function() {
      var result = testFullName($scope.chn);
      markErrorSuccess(result, '#divchn');
      return result;
    };

    /* test street */
    this.teststrt = function() {
      var result = testNewStreet($scope.strt);
      markErrorSuccess(result, '#divstrt');
      return result;
    };

    this.testzip = function() {
      var result = testNewZip($scope.zp);
      markErrorSuccess(result, '#divzip');
      return result;
    };

    this.testcity = function() {
      var result = testNewStreet($scope.city);
      markErrorSuccess(result, '#divcity');
      return result;
    };

    /* test country */
    this.testcntr = function() {
      var result = testCountry($scope.cntr);
      markErrorSuccess(result, '#divcntr');
      return result;
    };

    this.testcard = function() {
      var cn = $scope.cardNum;
      var result = testCardNum(cn.toString());
      markErrorSuccess(result, '#divcard');
      return result;
    }

    this.testCardDate = function() {
      var mo = $scope.selMonth;
      var ye = $scope.selYear;
      var result = true;
      if (typeof mo !== "undefined" && mo !== null) {
      }
      else {
        result = false;
      }
      if (typeof ye !== "undefined" && ye !== null) {
      }
      else {
        result = false;
      }
      markErrorSuccess(result, '#divDate');
      return result;
    }

    this.testcvv = function() {
      var result = testCVV($scope.cardNum.toString(), $scope.cvv.toString());
      markErrorSuccess(result, '#divcvv');
      return result;
    }

    this.makepurchase = function() {
      var res = true;
      var errorBody = "<ul>"
      if (!this.testchn()) {
        res = false;
        errorBody += "<li>The name you entered is invalid</li>";
      }
      if (!this.teststrt()) {
        res = false;
        errorBody += "<li>Street name is invalid</li>";
      }
      if (!this.testzip()) {
        res = false;
        errorBody += "<li>ZIP code is invalid</li>";
      }
      if (!this.testcity()) {
        res = false;
        errorBody += "<li>City name is invalid</li>";
      }
      if (!this.testcntr()) {
        res = false;
        errorBody += "<li>Country name is invalid</li>";
      }
      if (!this.testcard()) {
        res = false;
        errorBody += "<li>Card number is incorrect</li>";
      }
      if (!this.testCardDate()) {
        res = false;
        errorBody += "<li>Expiration dates are incorrect</li>";
      }
      if (!this.testcvv()) {
        res = false;
        errorBody += "<li>CVV number is incorrect</li>";
      }
      errorBody += "</ul>";

      if (res == true) {
        /* submit form */
        var payload = {};
        payload.uid = $scope.user.uid;
        payload.bid = $rootScope.buyBook;
        var d = new Date();
        payload.dateOf = d.toJSON();
        console.log(payload);
        comms.sync('/AddOwn', payload, function(data, textStatus, jqXHR) {
          console.log(data.result);
          $rootScope.buyBook = null;
          $rootScope.secondView = 'pages/myBooks.html';
          $rootScope.user = data.customer;
          console.log($rootScope.user);
          $('#btnMyBooks').removeClass().addClass('btn navbar-btn btn-default active');
          $('#btnStore').removeClass().addClass('btn navbar-btn btn-default');
          $scope.$apply();

        }, function(data, textStatus, errorThrown) {
          alert(textStatus + " " + errorThrown);
          console.log(textStatus + " " + errorThrown);
        }, null);
      }
      else {
        $('#errorsoutput').html(errorBody);
        $('#showError').modal();
      }
    }

      
    
  } ]);// controller
})();
