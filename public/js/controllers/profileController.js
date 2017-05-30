angular.module('rioApp').controller('profileController', function($scope,ajaxService,$timeout,$cookieStore) {
	console.log('profile controller')
	$scope.profile = $scope.$parent.user;
	$scope.profile.success =  false;
	$scope.profile.error =  false;
	$scope.wait =  false;
	console.log($scope.$parent.userdetails)
	$scope.location =  [{id:"che",name:"Chennai"},
					{id:"mum",name:"Mumbai"},
					{id:"blr",name:"Bangalore"}];
	$scope.profile.location = $scope.profile.location || $scope.location[0];
	$scope.updateProfile = function(profileForm){
		if($scope.profile.validate && profileForm.$valid){
			$scope.wait = true;
			ajaxService.ajaxData('/api/updateProfile','PUT',$scope.profile).
			then(function(x){
				console.log(x)
				if(x.status == 200 && x.statusText == "OK" && x.data.doc && !x.data.err){
					$scope.profile.success = true;
					$cookieStore.put("user",x.data.doc);
					$scope.$parent.user = x.data.doc;
				}else{
					$scope.profile.error = true;
				}				
				$timeout(function(){
					$scope.profile.success = false;
					$scope.profile.error = false;
				},2000)
				$scope.wait = false;
			},function(err) {        
	        	$scope.wait = false;
	     	});
		}else{
			$scope.profile.validate = true;
		}
	}
});