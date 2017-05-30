angular.module('rioApp').service('ajaxService', ajaxService);
ajaxService.$inject = ['$http', '$cookies','$state','$q'];      
function ajaxService($http,$cookies,$state,$q){  
    console.log('common service loaded');  	
	return {
        ajaxData: function(url,methodType,postInfo){
            var def = $q.defer();
            $http({
		        url:url, 
		        method: methodType, 
		        data: postInfo,                       
		        headers: {'Content-Type': 'application/json'}                        
		    }).then(function(x){
                data = x;
                def.resolve(x);
            },function(e){                
                console.log(e);
                def.reject("Failed to get datas");
            });
            return def.promise;
        }          
	}	
};	