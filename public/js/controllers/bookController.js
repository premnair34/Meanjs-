angular.module('rioApp').controller('bookController', function($scope,$state,$cookies,ajaxService,$timeout) {
	$scope.wait = false;
	$scope.mindate = new Date();
	$scope.rideType = [{name:"Personal",id:1},
					{name:"Corporate",id:2},
					{name:"Errand Services",id:3}];
	$scope.lovType = ["none","wedding","baby shower","engagement","house party"];
	var cityBounds = new google.maps.LatLngBounds(
	  new google.maps.LatLng(12.7342888,77.37919809999994),
	  new google.maps.LatLng( 13.173706,77.88268089999997));	 
	$scope.options = {
	    bounds: cityBounds,
	   types: ['(regions)'],
	  componentRestrictions: {country: "in"}
	};
	$scope.book = {
		validate : false,
		completed:false,
		saved:false,
		lov:$scope.lovType[0],
		type:$scope.rideType[0].id,
		isFirst:true
	};
	console.log($scope.book)
	$scope.createBook =  function(formName){
		$scope.book.validate = true;
		$scope.book.completed = false;
		$scope.book.saved = false;
		if(formName.$valid){
			$scope.book.userId = $scope.$parent.user._id;
			console.log($scope.book)
			$scope.book.isFirst = false;
			$scope.wait = true;
			$timeout(function() {
				initMap();
				$scope.wait = false;
			},300);
		}
	};


	$scope.confirmBook = function(){
		$scope.wait = true;
		ajaxService.ajaxData('/api/requestbook','POST',$scope.book).
		then(function(x){
			console.log(x)
			$scope.wait = true;
			$scope.book.validate  = false;
			$scope.book.completed = true;
			$scope.book.saved = true;
		},function(err) {        
        	$scope.wait = false;
     	}); 
	}

	function initMap() {
		new AutocompleteDirectionsHandler();
	}

	function AutocompleteDirectionsHandler(){
		var mapId = document.getElementById('map');
		var summaryId = document.getElementById('summary');
		mapId.style.display = 'block';
		summaryId.style.display = 'block';
		var map = new google.maps.Map(mapId, {
	    	mapTypeControl: false,
	    	center: {lat:-33.8688, lng:151.2195},
	    	zoom: 12
	  	});
	    this.originPlaceId = $scope.book.pickId;
	  	this.destinationPlaceId = $scope.book.dropId;
	  	this.map = map;
	  	this.travelMode = 'DRIVING';
	  	this.directionsService = new google.maps.DirectionsService;
	  	this.directionsDisplay = new google.maps.DirectionsRenderer;
	  	this.directionsDisplay.setMap(map);
	  	this.route(summaryId);
	}
	AutocompleteDirectionsHandler.prototype.route = function(summaryId) {
	  	if (!this.originPlaceId || !this.destinationPlaceId) {
	    	return;
	  	}
	  	var me = this;
		this.directionsService.route({	
			origin: {'placeId': this.originPlaceId},
	    	destination: {'placeId': this.destinationPlaceId},
	    	travelMode: this.travelMode,
	    	optimizeWaypoints: true
		  	}, function(response, status) {
		    if (status === 'OK') {
		      	me.directionsDisplay.setDirections(response);
		      	var routes = response.routes[0].legs[0];
				var summary = '<div><strong>Estimated Distance:</strong>'+routes.distance.text+'</div>';
				summary += '<div><strong>Estimated Time:</strong>'+routes.duration.text+'</div>';
				summaryId.innerHTML = summary;
		    } else {
		      window.alert('Directions request failed due to ' + status);
		    }
		});
	};

	$scope.showForm = function(action){
		$scope.book.isFirst = action;
		if(!$scope.book.isFirst)
			$timeout(function() {
				initMap();
				$scope.wait = false;
			},300);
	};
	
});