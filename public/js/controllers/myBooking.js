angular.module('rioApp').controller('myBookingCtrl', function($scope,$state,$timeout,ajaxService,$filter) {	
	$scope.wait = false;
	$scope.allBooking = [];
	$scope.oneAtATime = true;
	$scope.rate = 0;
  	$scope.max = 5;
  	//$scope.isReadonly = false;
	var type = [{name:"Personal",id:1},
	{name:"Corporate",id:2},
	{name:"Errand Services",id:3}]

	$scope.getAllBooking = function(){
		$scope.wait = true;
		ajaxService.ajaxData('/api/getbooking/'+$scope.$parent.user._id,'GET',null).
		then(function(x){
			//console.log(x)
			$scope.wait = false;
			if(x.status == 200 && x.statusText == "OK" && x.data.data && x.data.data.length != 0)			
				$scope.allBooking = x.data.data.reduce(data,[]);
				//console.log($scope.allBooking)
				
		},function(err) {        
	    	$scope.wait = false;
	 	});
	};

	let data = (a,e) => {	
		var date = moment(e.drop_date,'DD/MM/YYYY');
		var formatted = $filter('date')(date._d, 'd/M/yy');
		//console.log(e)
		var ridetype = type.reduce(function(a,f){
			if(f.id == e.type)
				a = f.name;
			return a;
		},{})
		
		let temp = {
			'pickup':e.pickup,
			'drop':e.drop,
			'drop_date':formatted,
			'date':date._d,
			'ridetype':ridetype,
			'open':false,
			'success':false,
			'driver':'Ramesh',
			'userId':e.userId,
			'_id':e._id,
			'phone':e.phone,
			'rating':e.rating,
			'lov':e.lov || 'None',
			'comments':e.comments,			
			'readonly':(e.comments || e.rating != 0)?true:false     				
		};
		a.push(temp);
		return a;
  	}
	$scope.getAllBooking();
	$scope.openItem = function(i){
		i.open = !i.open;
	};
	$scope.feedback = function(item){
		ajaxService.ajaxData('/api/postComment','PUT',item).
		then(function(x){			
			$scope.wait = false;
			if(x.status == 200 && x.statusText == "OK" && x.data){
				//	console.log(x.data)
				item.success =  true;
				$timeout(function() {
					item.readonly =  true;
					item.success =  false;
					console.log(item)
				},1500);
			}	
		},function(err) {        
	    	$scope.wait = false;
	 	});
	};
});