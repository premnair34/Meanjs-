var appRoutes = angular.module('appRoutes', []).config(routeConfig);
routeConfig.$inject = ['$stateProvider', '$locationProvider','$urlRouterProvider'];
function routeConfig($stateProvider, $locationProvider,$urlRouterProvider) {
  var onlyLoggedIn = function ($state,$q) {
    return true;
    /*var deferred = $q.defer();
    console.log(authService)
    if (authService.isLogin()) {
      alert()
      deferred.resolve();
    } else {       
      $state.go('login');
      deferred.reject();
      //deferred.reject();
    }
    return deferred.promise;*/
  };
	$stateProvider
	.state('welcome', {
		 url: '/',
          views:{
      		header:{
	            templateUrl: 'views/header.html'               
	        },
         	pageContent:{
              templateUrl: 'views/welcome.html',
              controller: 'welcomeController'
          	},
            footer:{
              templateUrl: 'views/footer.html',
            } 
          },public:true,        
	}).state('login', {
		 url: '/login',
          views:{
          	header:{
	            templateUrl: 'views/header.html'
	            //controller:"headerController"                 
	        },
         	pageContent:{
              templateUrl: 'views/login.html',
              controller: 'loginController'
          	},
            footer:{
              templateUrl: 'views/footer-mini.html',
            }	       
          },public:true,
          /*resolve:{
            loggedIn:onlyLoggedIn
          }*/
    }).state('registration', {
     url: '/registration',
          views:{
            header:{
              templateUrl: 'views/header.html'               
          },
          pageContent:{
              templateUrl: 'views/registration.html',
              controller: 'loginController'
            },
            footer:{
              templateUrl: 'views/footer-mini.html',
            }        
          },public:true,
         /* resolve:{
            loggedIn:onlyLoggedIn
          }*/
    }).state('verifyEmail', {
        url: '/verifyEmail/:email',
        views:{
          header:{
            templateUrl: 'views/header.html'
            //controller:"headerController"                 
        },
        pageContent:{
            templateUrl: 'views/verify.html',
            controller: 'verifyController'
          }         
        },public:true
    }).state('dashboard', {
		 url: '/dashboard',
          views:{
          	header:{
	            templateUrl: 'views/header.html'
	            //controller:"headerController"                 
  	        },
           	pageContent:{
              templateUrl: 'views/dashboard.html',
              controller: 'dashboardController'
          	},
            footer:{
              templateUrl: 'views/footer.html',
            }
          },public:false
    }).state('dashboard.booking', {
        url: '/booking',
        templateUrl: 'views/booking.html',
        controller: 'bookController',
        public:false             
    }).state('dashboard.mytrips', {
        url: '/mytrips',
        templateUrl: 'views/mytrips.html',
        controller: 'myBookingCtrl',
        public:false             
    }).state('dashboard.profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'profileController',
        public:false             
    }).state('privacy', {
      url: '/privacy-policy',
      views:{
        header:{
          templateUrl: 'views/header.html'                 
      },
      pageContent:{
          templateUrl: 'views/privacy.html',
          controller:'StaticController'
        },
        footer:{
          templateUrl: 'views/footer.html',
        }        
      },public:true
    }).state('terms', {
      url: '/terms',
      views:{
        header:{
          templateUrl: 'views/header.html'                 
      },
      pageContent:{
          templateUrl: 'views/terms.html',
          controller:'StaticController'
        },
        footer:{
          templateUrl: 'views/footer.html',
        }        
      },public:true
    })
	$urlRouterProvider.otherwise('/');
	$locationProvider.html5Mode(true);
};