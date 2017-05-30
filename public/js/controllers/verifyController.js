angular.module('rioApp').controller('verifyController', function($scope,$stateParams,$state,$cookieStore,ajaxService) {
	console.log($stateParams.email)	
	var verifyEmail =  (function(){		
		if($stateParams.email){
			ajaxService.ajaxData('/api/verifyEmail/'+$stateParams.email,'GET').
			then(function(x){
				console.log(x)
				$cookieStore.put("user",x.data.data);
				$cookieStore.put("success",true);
				$state.go('dashboard')	
			},function(err) {    
				console.log(err)
	     	});	
		}
	})();	
});