angular.module('rioApp').controller('loginController', function($scope,$state,$cookieStore,$timeout,ajaxService) {	
	console.log(ajaxService)
	/*if($state.current.name == 'login')
		$state.go('dashboard');*/
	$scope.isRegistration = false;
	$scope.wait = false;
	$scope.passwordType = 'password';
	$scope.userDetails = {};
	$scope.toggleForm = function (formName) {
		$scope.isRegistration = formName;
		$scope.passwordType = 'password';
		$scope.lsubmitted = false;
		$scope.rsubmitted =  false;
		$scope.userDetails = {};
	};

	$scope.registerUser = function(regForm){
		$scope.rsubmitted =  true;
		if($scope.rsubmitted && regForm.$valid){	
			$scope.wait = true;	
			$scope.rsubmitted =  false;
			 var temp = {
		        "email" :$scope.userDetails.email,
		        "password" :$scope.userDetails.password,
		        "name" :$scope.userDetails.name
			}
			ajaxService.ajaxData('/api/registration','POST',temp).then(function (x) {
				$scope.wait = false;
            	if(x.status == 200 && x.statusText == "OK" &&  !x.data.err){
            		$scope.userData = x.data.data;
	           		$cookieStore.put("user",$scope.userData);	 
	           		$cookieStore.put("success",true);
	           		$state.go('dashboard'); 
	           		$scope.userDetails = {};  	           
            	}else{
            		$scope.userDetails.errMsg = x.data.errText;
            		$timeout(function() {
            			$scope.userDetails = {};
            		},2000);
            	}
            },function(err) {        
            	$scope.wait = false;
         	});
		}

	};
	$scope.loginUser = function(formName){
		$scope.lsubmitted =  true;
		if($scope.lsubmitted && formName.$valid){			
			$scope.lsubmitted =  false;	
			$scope.wait = true;	
			ajaxService.ajaxData('/api/login','POST',$scope.userDetails).then(function (x) {
            	console.log(x)
            	$scope.wait = false;	
				if(x.status == 200 && x.statusText == "OK" &&  !x.data.err){
					$scope.$parent.isLogged  = true;
            		$scope.userData = x.data.data;
            		console.log($scope.userData)
	           		$cookieStore.put("user",$scope.userData);	 
	           		$cookieStore.put("success",true);	
	           		$state.go('dashboard');
	           		$scope.userDetails = {};          
            	}else if(x.data.err && x.data.errText){
            		$scope.userDetails.errMsg = x.data.errText;
            		$timeout(function() {
            			$scope.userDetails = {};
            		},2000);
            	}
            },function(err) {        
            	$scope.wait = false;
         	});	
		}		
	};

	$scope.showPassword = function(){
		$scope.passwordType = ($scope.passwordType == 'text')?'password':'text';		
	};
});