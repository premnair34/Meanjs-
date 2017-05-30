angular.module('rioApp').service('authService', authService);
authService.$inject = ['$cookies','$state'];      
function authService($cookies,$state){  
    console.log('auth service loaded');  	
	return {
        isLogin: function(){  
            return $cookies.get("success")
        }
        ,getUserName:function(){
            var user = $cookies.get("user");
            if($cookies.get("user")){
                user = JSON.parse(user);
                return user.name;
            }
        },isVerified:function(){
            var user = $cookies.get("user");
            if($cookies.get("user")){
                user = JSON.parse(user);
                return user.verified;
            }
        },getUser:function(){
            var user = $cookies.get("user");
            if($cookies.get("user")){
                user = JSON.parse(user);
                return user;
            }
        }                   
	}	
};	