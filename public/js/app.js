/*require('angular-moment');*/
angular.module('rioApp', ['ui.router','ui.bootstrap','ngAnimate','appRoutes','ngCookies','vsGoogleAutocomplete','directiveApp','moment-picker'])
.controller('appController',appController);
appController.$inject = ["$scope","$cookies","$state","$rootScope","authService"];
function appController($scope,$cookies,$state,$rootScope,authService) {
	$scope.page = new Object();
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $scope.page.name = toState.name;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        let loggedIn = $cookies.get('success');
        if(!toState.public && !loggedIn){
        	$scope.isLogged  = false;
            $state.go('login');
            event.preventDefault(); 
        }else{       	
          	$scope.isLogged  = (loggedIn)?true:false;
            $scope.user = authService.getUser();
            console.log($scope.user)
           /* if($scope.page.name === 'login' || $scope.page.name === 'registration' && $scope.isLogged){
                $state.go('dashboard');
            }*/
        }
        
    });
	$scope.logout = function(){
		$cookies.remove("user");
		$cookies.remove('success')
		$scope.isLogged = false;
		$state.go('login');
	}     
}
