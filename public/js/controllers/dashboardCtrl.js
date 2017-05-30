angular.module('rioApp').controller('dashboardController', function($scope,$state,$cookies) {
	/*let getUser = (function(){
		if($cookies.get("user") && typeof $cookies.get("user") !== Object)
			$scope.userdetails =  JSON.parse($cookies.get("user"));
		else
			$state.go("login")
	})();*/

	$scope.stateLoad = function(){   
	    $scope.changeRoute($scope.routingItems[0]);
	};

/*	$scope.logout = function(){
		$cookies.remove("user");
		$cookies.remove('success')
		$scope.isLogged = false;
		$state.go('login');
	};*/

	$scope.routingItems = [
      { name:'Booking',route: "dashboard.booking"},
      { name:'Profile',route: "dashboard.profile"},
  	  { name:'My Trips',route: "dashboard.mytrips"}
    ];

    $scope.changeRoute = function(item){
    	$scope.activeRoute = item;
    	$state.go(item.route);
    };
    
    $scope.resendActivation = function(){
		$scope.wait = true;
		ajaxService.ajaxData('/api/resendActivation/'+$scope.$parent.user.email,'GET',null).
		then(function(x){
			//console.log(x)
			$scope.wait = false;
			if(x.status == 200 && x.statusText == "OK" && !x.data.err)			
				$scope.msg = x.data.message;
			console.log($scope.msg)				
		},function(err) {        
	    	$scope.wait = false;
	 	});
	};
});