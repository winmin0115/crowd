'use strict';
/*
* AngularJS MultiMarker
* Copyright Lee Seok Joo
*/
angular.module('multiMarker', []).factory('multiMarker',  function () {
	var earth = 6371000.0;
	var distanceArray = new Array();
	var distance = earth / 4.5;
	distanceArray.push(distance);
	for(var i=0;i<23;i++){
		distance = distance / 2;
		distanceArray.push(distance);
	}		
	return{
		// 위치 모니터링
		getDistance: function(markers, item, zoom){
			var EARTH_R, Rad, radLat1, radLat2, radDist; 
	        var distance, ret;
	        Rad	= Math.PI/180;			
	        var infoArray = new Array();
			
			if(item.lat != null && item.lng != null && item.lat != undefined && item.lng != undefined){
		    	angular.forEach(markers, function(value, index) {
					angular.forEach(value, function(value, key){
						if(value.lat != null && value.lng != null && value.lat != undefined && value.lng != undefined){						
				            radLat1 = Rad * item.lat;
				            radLat2 = Rad * value.lat;
				            radDist = Rad * (item.lng - value.lng);			            
				            distance = Math.sin(radLat1) * Math.sin(radLat2);
				            distance = distance + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radDist);
				            ret = earth * Math.acos(distance);			      
				            var rtn = Math.round(Math.round(ret));			            
				            if(rtn < distanceArray[zoom]){
				            	infoArray.push({data:value,idx:index});	
				            }
						}
					});				
		    	});     								
			}	        
			
	        return infoArray;
		},	
		// 디바이스 모니터링
		getDistance2: function(markers, item, zoom){
			var EARTH_R, Rad, radLat1, radLat2, radDist; 
	        var distance, ret;
	        Rad	= Math.PI/180;			
	        var infoArray = new Array();
			
			if(item.LA != null && item.LO != null && item.LA != undefined && item.LO != undefined){
		    	angular.forEach(markers, function(value, index) {
					if(value.LA != null && value.LO != null && value.LA != undefined && value.LO != undefined){						
			            radLat1 = Rad * item.LA;
			            radLat2 = Rad * value.LA;
			            radDist = Rad * (item.LO - value.LO);			            
			            distance = Math.sin(radLat1) * Math.sin(radLat2);
			            distance = distance + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radDist);
			            ret = earth * Math.acos(distance);			      
			            var rtn = Math.round(Math.round(ret));			            
			            if(rtn < distanceArray[zoom]){
			            	infoArray.push({data:value,idx:index});	
			            }
					}				
		    	});     								
			}	        
			
	        return infoArray;
		},	
		
		// 디바이스 목록
		getDistance3: function(markers, item, zoom){
			var EARTH_R, Rad, radLat1, radLat2, radDist; 
	        var distance, ret;
	        Rad	= Math.PI/180;			
	        var infoArray = new Array();
			
			if(item.la != null && item.lo != null && item.la != undefined && item.lo != undefined){
		    	angular.forEach(markers, function(value, index) {
					if(value.la != null && value.lo != null && value.la != undefined && value.lo != undefined){						
			            radLat1 = Rad * item.la;
			            radLat2 = Rad * value.la;
			            radDist = Rad * (item.lo - value.lo);			            
			            distance = Math.sin(radLat1) * Math.sin(radLat2);
			            distance = distance + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radDist);
			            ret = earth * Math.acos(distance);			      
			            var rtn = Math.round(Math.round(ret));			            
			            if(rtn < distanceArray[zoom]){
			            	infoArray.push({data:value,idx:index});	
			            }
					}				
		    	});     								
			}	        
			
	        return infoArray;
		}			
	}
});