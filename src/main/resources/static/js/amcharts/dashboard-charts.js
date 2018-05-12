'use strict';
angular.module('dashboardCharts', []).directive('dashboardChart', ['$q', function ($q) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
		  index: '=',
		  data: '=',
		  type: '@',
		  datafunc: '&'
		},
		template: '<div id="chart-{{index}}" style="width: 100%; height: 250px; margin: 0 auto"></div>',
		link: function ($scope, $el) {
      
			var id = "chart-" + $scope.index;
			
			var chart;
			$scope.chart = chart;			

			$q.when($scope.type).then(function(type){
				var renderChart = function () {					
					if(type=='act'){						
						chart = AmCharts.makeChart("chart-{{index}}", {
							"type": "serial",
							"theme": "none",
							"fontFamily": "Noto Sans KR",
							"marginLeft": 20,
							"dataProvider": $scope.data[0],
							"valueAxes": [{
								"axisAlpha": 0,
								"inside": true,
								"position": "left",
								"ignoreAxisWidth": true
							}],
							"graphs": [{
								"balloonText": "<div style='margin:10px; text-align:left'><span style='font-size:11px'>[[ct]]</span><br><span style='font-size:18px'>[[data]] [[symbol]]</span></div>",
								"bullet": "round",
								"bulletSize": 4,
								"lineColor": "#d1655d",
								"lineThickness": 2,
								"fillAlphas": 0.2,
								"valueField": "data"
							}],
							"chartScrollbar": {},
							"chartCursor": {
								"categoryBalloonDateFormat": "YYYY-MM-DD",
								"cursorAlpha": 0,
								"cursorPosition": "mouse"
							},
							"dataDateFormat": "YYYY-MM-DD JJ:NN:SS",
							"categoryField": "ct",
							"categoryAxis": {
								"parseDates": true,
								"minorGridAlpha": 0.1,
								"minorGridEnabled": true,
								"minPeriod": "ss",
								"dateFormats": [{
									"period": 'fff',
									"format": 'JJ:NN:SS'
								}, {
									"period": 'ss',
									"format": 'JJ:NN:SS'
								}, {
									"period": 'mm',
									"format": 'JJ:NN'
								}, {
									"period": 'hh',
									"format": 'JJ:NN'
								}, {
									"period": 'DD',
									"format": 'DD일'
								}, {
									"period": 'WW',
									"format": 'DD'
								}, {
									"period": 'MM',
									"format": 'MMM'
								}, {
									"period": 'YYYY',
									"format": 'YYYY'
								}]	                
							}
						});        			  
					}else if(type=='rct'){
						chart = AmCharts.makeChart("chart-{{index}}", {
							"type": "serial",
							"theme": "none",
							"fontFamily": "Noto Sans KR",
							"marginLeft": 20,
							"dataProvider": $scope.data[0],
							"valueAxes": [{
								"axisAlpha": 0,
								"inside": true,
								"position": "left",
								"ignoreAxisWidth": true
							}],
							"graphs": [{
								"balloonText": "<div style='margin:10px; text-align:left'><span style='font-size:11px'>[[ct]]</span><br><span style='font-size:18px'>[[data]] [[symbol]]</span></div>",
								"bullet": "round",
								"bulletSize": 4,
								"lineColor": "#d1655d",
								"lineThickness": 2,
								"fillAlphas": 0.2,
								"valueField": "data"
							}],
							"chartScrollbar": {},
							"chartCursor": {
								"categoryBalloonDateFormat": "YYYY-MM-DD",
								"cursorAlpha": 0,
								"cursorPosition": "mouse"
							},
							"dataDateFormat": "YYYY-MM-DD JJ:NN:SS",
							"categoryField": "ct",
							"categoryAxis": {
								"parseDates": true,
								"minorGridAlpha": 0.1,
								"minorGridEnabled": true,
								"minPeriod": "ss",
								"dateFormats": [{
									"period": 'fff',
									"format": 'JJ:NN:SS'
								}, {
									"period": 'ss',
									"format": 'JJ:NN:SS'
								}, {
									"period": 'mm',
									"format": 'JJ:NN'
								}, {
									"period": 'hh',
									"format": 'JJ:NN'
								}, {
									"period": 'DD',
									"format": 'DD일'
								}, {
									"period": 'WW',
									"format": 'DD'
								}, {
									"period": 'MM',
									"format": 'MMM'
								}, {
									"period": 'YYYY',
									"format": 'YYYY'
								}]	                
							}
						});    			  
					}else if(type=='sts'){		
						function categoryBalloonText(graphDataItem, graph){
							var value = graphDataItem.values.value;
					        return value;
						}
						  						
						chart = AmCharts.makeChart("chart-{{index}}", {
						    "type": "serial",
						    "theme": "light",
						    "fontFamily": "Noto Sans KR",
						    "dataProvider": $scope.data,
						    "valueAxes": [ {
						    	"stackType": "regular",
						    	"axisAlpha": 0,
						    	"gridAlpha": 0,
						    	"labelsEnabled": false,
						    	"maximum": 100
						    } ],
						    "graphs": [ {
						        "balloonText": "<span style='font-size:14px'><b>[[title]]</b></span><br><span style='font-size:14px'><b>[[status_msg]]</b></span><br><span style='font-size:11px'><b>[[timeMsg]]</b></span>",
						        "fillAlphas": 0,
						        "lineAlpha": 0,
						        "labelText": "[[status_msg]]",
						        "title": "장치상태",
						        "type": "column",
						        "colorField": "colorStatus",
						        "valueField": "bar",
						        "customBulletField": "bulletStatus",
						        "bulletSize":90,
						        "fontSize": 14,
						        "labelPosition": "bottom",
						        "fixedColumnWidth": 80
						    }, {
					            "newStack": true,
						        "balloonText": "<span style='font-size:14px'><b>[[title]]</b></span><br><span style='font-size:14px'><b>[[battery_msg]]</b></span><br><span style='font-size:11px'><b>[[battery_value]]</b></span>",
						        "fillAlphas": 0,
						        "lineAlpha": 0,
						        "labelText": "[[battery_msg]]",
						        "title": "배터리",
						        "type": "column",
						        "colorField": "colorBattery",
						        "valueField": "bar",
						        "customBulletField": "bulletBattery",
						        "bulletSize":90,
						        "fontSize": 14,
						        "labelPosition": "bottom",
						        "fixedColumnWidth": 80						        
						    }],
						    "categoryField": "device_id",
						    "categoryAxis": {						    	
						        "gridPosition": "start",
						        "axisAlpha": 0,
						        "gridAlpha": 0,
						        "position": "left",
						        "fontSize": 14,
						        "boldLabels":true,
						        "labelFunction": function(valueText, serialDataItem) {
						        	return serialDataItem.dataContext.device_nm;
						        }
						    },
							"chartCursor": {
								"categoryBalloonEnabled": true,
								"categoryBalloonColor": "#ff0000",
						        "cursorAlpha": 0.1,
						        "fullWidth":true,
							    "graphBulletSize": 1,
							    "zoomable": false
							},		
							"balloon": {
							    "fillAlpha": 1
							},
							"zoomOutText": "",						
						});  	
					}
					chart.write(id);
	                $scope.chart = chart;
				};

				renderChart();


				// EVENTS =========================================================================

				var onAmChartsUpdateData = $scope.$on('amCharts.updateData', function (event, data, id) {
					if (id === $el[0].id || !id) {	                
						chart.dataProvider = data;
						chart.validateData();
						if (chart.dataProvider === undefined || chart.dataProvider.length === 0) {
							$scope.datafunc({arg1: $scope.index});
						}		        		
					}
				});
				
			});
		}
    }
}]);
