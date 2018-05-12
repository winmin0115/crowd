var App = angular.module("App", ['dashboardCharts','gridster','checklist-model']);
App.controller("Controller", function($scope, $http, $window, $compile, $timeout, $interval, $httpParamSerializerJQLike) {
	
	$scope.commonVO	= {
		gbn: ''
	};
	
	$scope.schTxt = "";                    // 검색어
	$scope.selWidget = "";                 // 선택 위젯
	$scope.deviceId = "";                  // 디바이스 ID
	$scope.hpage_size = 5;                 // 이력차트 사이즈
	$scope.emptyShow = false;              // 빈대시보드 처리 
	$scope.poploader = false;              // 팝업
	$scope.dbLoadList = [];                // 로딩리스트
	$scope.dbNoData = [];                  // 노데이터 리스트
	$scope.chkDeviceItem = [];             // 디바이스 선택리스트
	$scope.chkOneItem = {item: ''};        // 단일체크
	$scope.chkMultiItem = [];	       // 다중 체크리스트
	$scope.itemChoiseList = [];            // 센서 아이템 목록
	$scope.updateFlag = [];                // 실시간 차트 자동 업데이트 상태
	$scope.interval = [];                  // 실시간 차트 인터발
	$scope.interval2 = [];                 // http 에러방지 실시간 체크 인터발
	$scope.request = false;                // 실시간 요청상태 체크
	$scope.batteryImageOk = "/images/tov/bar_battery_ok.png"
	$scope.batteryImageError = "/images/tov/bar_battery_error.png"		
	$scope.statusImageOk = "/images/tov/bar_status_ok.png"
	$scope.statusImageError = "/images/tov/bar_status_error.png"
	$scope.stsColorOk = "#95f989";		
	$scope.stsColorError = "#fe9b36";
	$scope.sArray = [];
	$scope.s =document.styleSheets[0];
	
	//초기값
	$scope.curDispenserId = $("#currentDispenserId").val();
    
	
	
	$scope.fInit = function(){
		_popupHideAll();
		$scope.load();
	}

	// 초기 셋팅
	$scope.fDefaultSetting = function(){		
		angular.forEach($scope.interval,function(value,index){
			if($scope.interval[index] != null){
				$interval.cancel($scope.interval[index]);
				$scope.interval[index] = null;
			} 
		});
		angular.forEach($scope.interval2,function(value,index){
			if($scope.interval2[index] != null){
				$interval.cancel($scope.interval2[index]);
				$scope.interval2[index] = null;
			} 
		});				
		$scope.dbloadList = [];
		$scope.dbNoData = []; 
		$scope.chkDeviceItem = [];
		$scope.chkOneItem = {item: ''};
		$scope.chkMultiItem = [];		
		$scope.itemChoiseList = [];
		$scope.updateFlag = [];
		$scope.interval = [];
		$scope.interval2 = [];
		$scope.request = false;		
		
	}
	
	$scope.fStsSetting = function(index){		
		angular.forEach($scope.dtlList[index],function(data,key){    					
			if(data.battery == "0"){
				$scope.dtlList[index][key].bulletBattery = $scope.batteryImageOk;
				$scope.dtlList[index][key].colorBattery = $scope.stsColorOk;
			}else{
				$scope.dtlList[index][key].bulletBattery = $scope.batteryImageError;
				$scope.dtlList[index][key].colorBattery = $scope.stsColorError;
			}
			if(data.status == "0"){
				$scope.dtlList[index][key].bulletStatus = $scope.statusImageOk;
				$scope.dtlList[index][key].colorStatus = $scope.stsColorOk;
			}else{
				$scope.dtlList[index][key].bulletStatus = $scope.statusImageError;
				$scope.dtlList[index][key].colorStatus = $scope.stsColorError;
			}    					
			$scope.dtlList[index][key].bar = 53;
		});    		
	}	
	
	//대시보드 로딩 시..
	//브랜치 세션을 통해서 브랜치 넘버를 알고
	//브랜치 넘버를 통해서 디스펜서 리스트.. => 셀렉트박스
    //해당 디스펜서 테이블에 dashboardYn 설정을 통해서...사용 여부 확인
	//nt_dispenser dashboardYn을 통해 조회
	//그 디스펜서 아이디를 통해서 API SERVER에 GET
	
	
	
	
	
	//초기에 디스펜서 정보(밸브 갯수 포함) + 디바이스 정보
	//디스펜서 조회
	
	//디스펜서 목록 조회
	$scope.getDispensers = function(){
		$http({
			method		: 'GET',
			url			: '/chs/dispenserListJson.do'
		}).success(function(data, status, headers, config){
		     $scope.dispenserList = data.list;
		     $scope.currentBranchNm = data.list[0].branch_nm;
			_loading.hide();
		}).error(function(data, status, headers, config){														
			$window.alert(_getMsg("msg.error.inq"));
			_loading.hide();
		});  
	}
	//디스펜서 조회
	$scope.getDispenser = function(dispenserId){
		console.log("dispenserId : " + dispenserId);
		console.log("curdispenserId : " + $scope.curDispenserId);
    	$http({
			method		: 'GET',
			url      	: '/chs/dashboard/dispensers/'+dispenserId,
			params		: { "curDispenserId" : $scope.curDispenserId }
		})
		.success(function(data, status, headers, config){
			$scope.emptyShow = false;
			$scope.dbList = data.valves;
			console.log("retrieve : " + $scope.dbList[0].usage);
			//$scope.status = data.status;
			//$scope.calStatus ==> 시간을 계산해서 $scope.statusCheck 에서 fail ok를 한다.
			$scope.statusCheck = 'ok';
//			var addStatus = {
//				widg_knd : "status",
//				label : "상태"
//			};
//			$scope.dbList.push(addStatus);
			$scope.curDispenserId = dispenserId;
			$scope.connect();
			// 기초 데이터 셋팅
			angular.forEach($scope.dbList,function(value,index){
				if(value.widg_knd == null){
					console.log($scope.dbList[index]);
					$scope.dbList[index].widg_knd = 'valve';
					console.log("imageUrl : " + value.imageUrl);
					console.log("usage : " + value.remainder);
					updateBattery(value.imageUrl, value.remainder);
			        $('.percentage').text(value.usage);
			        $('.units').text('%');
			        $('.battery-text').css('opacity', 1);
			        $('.slider input').animate({ value: value.usage }, 500, 'easeOutQuad');

			        setTimeout(function(){
			            $('#liquid-'+value.imageUrl).show();
			        }, 500);
				}
			});
			_loading.hide();
		})
		.error(function(data, status, headers, config){														
			$window.alert(_getMsg("msg.error.inq"));
			_loading.hide();
		});  
	}
	
	
	
	////////socket
	// stomp client session을 전역 변수로 선언
	var stompClient = null;

	//웹소켓으로 서버에 접속한다.
	$scope.connect = function() {
		// 서버소켓의 endpoint인 "/dashboard"로 접속할 클라이언트 소켓 생성
		var socket = new SockJS('http://main.norimsu.pe.kr:9090/dashboard');
		// 전역 변수에 세션 설정
		stompClient = Stomp.over(socket);

		//---------------------
		stompClient.connect({}, function(frame) {

			// 콘솔 출력 결과는 다음과 같다.
			// Connected: CONNECTED
			// heart-beat:0,0
			// version:1.1
			console.log('Connected: ' + frame);

			// 토픽이 "/topic/dashboard/1"로 수신되는 메시지는 showGreeting 함수로 처리하도록 stompClient에 등록. 
			stompClient.subscribe('/topic/dashboard/' + $scope.curDispenserId, function(greeting) {
				$scope.dispenserVavles = JSON.parse(greeting.body).valves;
				angular.forEach($scope.dispenserVavles,function(value,index){
					console.log("connect : "  + value.imageUrl);
					console.log("connect remainder : "  + value.remainder);
						$scope.dbList[index].widg_knd = 'valve';
						$scope.dbList[index].remainder = value.remainder;
						$scope.dbList[index].usedBox = value.usedBox;
						updateBattery(value.imageUrl, value.remainder);
				        $('.percentage').text(value.usage);
				        $('.units').text('%');
				        $('.battery-text').css('opacity', 1);
				        $('.slider input').animate({ value: value.usage }, 500, 'easeOutQuad');
				        setTimeout(function(){
				            $('#liquid-'+value.imageUrl).show();
				        }, 500);
				});
			});
		});
	}

	//서버와의 소켓 연결을 끊는다.
	function disconnect() {
		if (stompClient !== null) {
			stompClient.disconnect();
		}
		setConnected(false);
		console.log("Disconnected");
	}

	//send 버튼을 클릭했을 때 처리할 함수를 정의한다.
	function sendSeq() {
		// 연결된 세션으로 전송한다.
		// 대상 토픽을 "/app/hello"로 정의 했지만 서버에서는 WebSocketConfig.java에 설정된 prefix가 적용되어 "/topic/app/hello"로 처리됨.
		// 'name'은 속성의 key 값으로 HelloMessage.java의 name 필드와 이름을 맞춘것이다.
		// '#name'은 속성의 value 값으로 index.html의 input id="name"과 이름을 맞춘것이다.
		stompClient.send("/dispenser/" + $("#name").val(), {}, JSON.stringify({ 'name' : $("#name").val() }));
	}

	//서버로 부터 수신한 메시지를 웹브라우저에 출력한다.
	function showPrompt(message) {
		// '#greetings'는 index.html의 tbody id="greetings"이다.
		// 즉 메시지를 수신할 때마다 테이블의 row가 추가된다.
		$("#prompt").append("<tr><td><pre>" + message + "</pre></td></tr>");
	}

	//html에서 발생한 이벤트를 처리하는 함수를 정의한다. 
	$(function() {
		// form 태그에서 submit 타입의 이벤트를 처리한다.
		$("form").on('submit', function(e) {
			e.preventDefault();
		});

		// connect 버튼 클릭 시 connect() 함수 호출
		$("#connect").click(function() {
			connect();
		});
		// disconnect 버튼 클릭 시 disconnect() 함수 호출
		$("#disconnect").click(function() {
			disconnect();
		});
		// send 버튼 클릭 시 sendName() 함수 호출
		$("#send").click(function() {
			sendSeq();
		});
	});
	
	
	
	
	
	
	
	
	
	//디스펜서 초기 조회 
	$scope.load = function(){			
		_loading.show();
				
		$scope.fDefaultSetting();
		
		
		
		if($scope.curDispenserId == '' || $scope.curDispenserId == null){
			$scope.emptyShow = true;
			
		}else{
			$scope.getDispenser($scope.curDispenserId);

		}
		$scope.getDispensers();
	}; 			
	
	$scope.getSelectedDispenser = function(){
		console.log("===:"+$scope.selDispenserId);
		$scope.getDispenser($scope.selDispenserId);
	}
	
	
	// 추가
	$scope.fCreate = function(type, id){
		$scope.commonVO.gbn = "C";
		$scope.deviceId = "";
		var def_sizeX = 1;
		var def_sizeY = 1;
		if(id=='act'||id=='rct'||id=='sts'){
			def_sizeX = 3;
		}
		$scope.widget = {widg_nm: type, widg_knd: id, sizeX:def_sizeX, sizeY:def_sizeY, ofd_type:'A'};
		$scope.fWidget();				 																						
	}
	
		
	// 설정
	$scope.fSetting = function(idx){		
		$http({
			method		: 'GET',
			url      	: '/chs/dashboardWidget.json',
			params      : {sn: $scope.dbList[idx].sn}
		})
		.success(function(data, status, headers, config){
			$scope.widget = data.data;
			$scope.commonVO.gbn = "U";
			$scope.deviceId = "";
			$scope.fWidget();																	
		})
		.error(function(data, status, headers, config){
			$window.alert(_getMsg("msg.error"));
		});  											 					 																					
	}						
		
	// 위젯조회
	$scope.fWidget = function(){			
		$http({
			method		: 'GET',
			url      	: '/chs/dashboardWidgetView.json',
			params      : {gbn: $scope.commonVO.gbn, widg_knd: $scope.widget.widg_knd, device_no: $scope.widget.device_no, sensor_no: $scope.widget.sensor_no}
		})
		.success(function(data, status, headers, config){
			$scope.objList1 = data.list1;					
			$scope.objList2 = data.list2;
			$scope.objList3 = data.list3;
			$scope.chkDeviceItem = [];
			$scope.chkOneItem = {item: ''};
			$scope.chkMultiItem = [];
			if($scope.widget.modl_item){
				if($scope.widget.widg_knd == 'sen' || $scope.widget.widg_knd == 'ofd'){
					$scope.chkOneItem.item = $scope.widget.modl_item;		
				}else{
					$scope.chkMultiItem = JSON.parse($scope.widget.modl_item);					
				}								
			}
			if($scope.widget.device_no){
				if($scope.widget.widg_knd == 'dvc' || $scope.widget.widg_knd == 'sen' || $scope.widget.widg_knd == 'hct' || $scope.widget.widg_knd == 'ofd' || $scope.widget.widg_knd == 'act' || $scope.widget.widg_knd == 'rct'){
	            	angular.forEach($scope.objList1,function(value,index){
	            		if(value.sn == $scope.widget.device_no){
			            	$scope.deviceId = value.device_id;
	            		} 
	            	});	
				}
			}					
			if($scope.widget.device_item){
				if($scope.widget.widg_knd == 'sts'){
					$scope.ChkTemp = JSON.parse($scope.widget.device_item);
		            angular.forEach($scope.ChkTemp,function(value,index){
		            	angular.forEach($scope.objList1,function(data,idx){
		            		if(data.sn == value){
				            	$scope.chkDeviceItem.push({sn:value,device_id:data.device_id});
		            		} 
		            	});		            	
		            });    							
				}								
			}			
			_popupShow($scope.widget.widg_knd);			
		})
		.error(function(data, status, headers, config){
			$window.alert(_getMsg("msg.error.inq"));
		});  					 	
	}					
		
		
	//새로고침
	$scope.fRefresh = function(idx){	
		$scope.dbLoadList[idx] = true;				
		$http({
			method		: 'GET',
			url      	: '/dashboard/dashboardRefresh.json',
			params      : {"data":$scope.dbList[idx]}					
		})
		.success(function(data, status, headers, config){
			$scope.dtlList[idx] = data.dtlList;		
			if($scope.dbList[idx].widg_knd == 'act'){
				$scope.fChartDataUpdate(idx);
			}
			$scope.dbLoadList[idx] = false;
		})
		.error(function(data, status, headers, config){	
			$window.alert(_getMsg("msg.error.reset"));
			$scope.dbLoadList[idx] = false;
		});  					 	
	}		
	
	$scope.fSelectDevice = function(type){
		$scope.selWidget = type;
		if($scope.selWidget == 'sts'){
	    	if($scope.chkDeviceItem.length > 5){
	    		$window.alert(_getMsg("msg.label.device") + "는 최대 6개 까지 등록가능합니다.");
	       	}else{
	       		_popupShow("selDeivce");       		
	       	}						
		}else{
       		_popupShow("selDeivce");			
		}
	}
	
	$scope.fSetDevice = function(idx, device_id){		
		_popupHide("selDeivce");
		if($scope.selWidget == 'sts'){
	    	if($scope.chkDeviceItem.length > 5){
	    		$window.alert(_getMsg("msg.label.device") + "는 최대 6개 까지 등록가능합니다.");
	       	}else{
	       		$scope.chkDeviceItem.push({sn:idx,device_id:device_id});       		
	       	}					
		}else if($scope.selWidget == 'dvc' || $scope.selWidget == 'hct'){
			$scope.widget.device_no = idx;
           	$scope.deviceId = device_id;            				
		}else if($scope.selWidget == 'sen' || $scope.selWidget == 'ofd' || $scope.selWidget == 'act' || $scope.selWidget == 'rct'){
			$scope.widget.device_no = idx;
           	$scope.deviceId = device_id;            							
			$scope.fDvcChange();
		}
	}		
	
	$scope.fRemoveDevice = function(idx, device_id){
		if(!$window.confirm(device_id + _getMsg("msg.confirm.del"))) {
			return;
		}							 								
		$scope.chkDeviceItem.splice(idx, 1);
	}
		
	$scope.fSave = function(){		
		if(!$scope.fValidation()){
			return;
		}
		var gbn = $scope.commonVO.gbn;
		var in_msg = "";					
		var out_msg = "";
		if(gbn == 'U'){
			in_msg = _getMsg("msg.confirm.edit");
			out_msg = _getMsg("msg.complete.edit");												
		}else if(gbn == 'D'){
			in_msg = _getMsg("msg.confirm.del");
			out_msg = _getMsg("msg.complete.del");						
		}else if(gbn == 'C'){
			in_msg = _getMsg("msg.confirm.reg");
			out_msg = _getMsg("msg.complete.reg");
		}					
							
		if(!$window.confirm($scope.widget.widg_nm + in_msg)) {
			return;
		}							 						
		
		$scope.poploader = true;
		
    	if($scope.widget.widg_knd == 'act' || $scope.widget.widg_knd == 'rct'){
    		$scope.widget.modl_item = angular.toJson($scope.chkMultiItem);
    	}else if($scope.widget.widg_knd == 'sen' || $scope.widget.widg_knd == 'ofd'){
    		$scope.widget.modl_item = $scope.chkOneItem.item;
    	}else if($scope.widget.widg_knd == 'sts'){
    		$scope.deviceTemp = [];
            angular.forEach($scope.chkDeviceItem,function(value,index){
            	$scope.deviceTemp.push(value.sn);
            });    		
            $scope.widget.device_item = angular.toJson($scope.deviceTemp);
    	}else{
    		$scope.widget.modl_item = "";
    	}
					
        $http({
            method      : 'POST',
            url         : '/chs/dashboardCUD.json',
            headers     : {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},                        
            data        : $httpParamSerializerJQLike({"gbn": $scope.commonVO.gbn, "data": angular.toJson($scope.widget)})                                                
        })										
        .success(function (data, status, headers) {
		   	if(data.result == "ok") {
            	$window.alert(out_msg);			            				            	
			    $scope.load();
		   	}else{		   		
		   		$window.alert(_getMsg("msg.error"));		   				   		
		   	}	
		   	$scope.poploader = false;
		   	$scope.schTxt = "";
		   	_popupHideAll();
    	})
		.error(function(data, status, headers, config){			
			$window.alert(_getMsg("msg.error"));
			$scope.poploader = false;
			_popupHideAll();
		});	                    
	}
		
	$scope.fValidation = function(){
		var knd = $scope.widget.widg_knd;
		switch(knd) {
	    	case 'dvc':
				var frm = $scope.fm_dvc;	
			 	if (!frm.$valid) {				 		
	            	if(frm.input_widg_nm.$invalid){
	            		$window.alert(_getMsg("msg.label.name") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}		
	            	if(frm.device_no.$invalid){
	            		$window.alert(_getMsg("msg.label.device") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}				            					 		
		        }					        	
			 	break;
	     	case 'sgp':
				var frm = $scope.fm_sgp;					
			 	if (!frm.$valid) {				 		
	            	if(frm.input_widg_nm.$invalid){
	            		$window.alert(_getMsg("msg.label.name") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}		
	            	if(frm.sensor_group_no.$invalid){
	            		$window.alert(_getMsg("msg.label.sengrp") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}				            					 		
		        }				     		
	        	break;
	     	case 'sen':
				var frm = $scope.fm_sen;					
			 	if (!frm.$valid) {				 		
	            	if(frm.input_widg_nm.$invalid){
	            		$window.alert(_getMsg("msg.label.name") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}	
	            	if(frm.device_no.$invalid){
	            		$window.alert(_getMsg("msg.label.device") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}		            	
	            	if(frm.sensor_no.$invalid){
	            		$window.alert(_getMsg("msg.label.sensor") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}			
	            	if($scope.chkOneItem.item == ''){
	            		$window.alert(_getMsg("msg.label.modlitem") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}			            	
		        }				     		
	        	break;
	     	case 'act':
				var frm = $scope.fm_act;					
			 	if (!frm.$valid) {				 		
	            	if(frm.input_widg_nm.$invalid){
	            		$window.alert(_getMsg("msg.label.name") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}		
	            	if(frm.device_no.$invalid){
	            		$window.alert(_getMsg("msg.label.device") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}		            	
	            	if(frm.sensor_no.$invalid){
	            		$window.alert(_getMsg("msg.label.sensor") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}
	            	if($scope.chkMultiItem.length < 1){
	            		$window.alert(_getMsg("msg.label.modlitem") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}		            	
	            	if(frm.actvty_time_ty.$invalid){
	            		$window.alert(_getMsg("msg.label.sdate") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}					            	
		        }				     		
	        	break;
	     	case 'rct':
				var frm = $scope.fm_rct;					
			 	if (!frm.$valid) {				 		
	            	if(frm.input_widg_nm.$invalid){
	            		$window.alert(_getMsg("msg.label.name") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}
	            	if(frm.device_no.$invalid){
	            		$window.alert(_getMsg("msg.label.device") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}		            	
	            	if(frm.sensor_no.$invalid){
	            		$window.alert(_getMsg("msg.label.sensor") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}
	            	if($scope.chkMultiItem.length < 1){
	            		$window.alert(_getMsg("msg.label.modlitem") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}		            	
		        }				     		
	        	break;		
	     	case 'hct':
				var frm = $scope.fm_hct;					
			 	if (!frm.$valid) {				 		
	            	if(frm.input_widg_nm.$invalid){
	            		$window.alert(_getMsg("msg.label.name") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}		
	            	if(frm.device_no.$invalid){
	            		$window.alert(_getMsg("msg.label.device") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}								            	
		        }				     		
	        	break;		        	
	     	case 'ofd':
				var frm = $scope.fm_ofd;					
			 	if (!frm.$valid) {				 		
	            	if(frm.input_widg_nm.$invalid){
	            		$window.alert(_getMsg("msg.label.name") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}
	            	if(frm.device_no.$invalid){
	            		$window.alert(_getMsg("msg.label.device") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}		            	
	            	if(frm.sensor_no.$invalid){
	            		$window.alert(_getMsg("msg.label.sensor") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}
	            	if($scope.chkOneItem.item == ''){
	            		$window.alert(_getMsg("msg.label.modlitem") + _getMsg("msg.select"));
	            		return false;
	            		break;
	               	}
	            	if(frm.ofd_type.$invalid){
	            		$window.alert(_getMsg("msg.label.ofdtype") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}	
	            	if($scope.widget.ofd_type == 'A'){
	            		if(frm.appn_value.$invalid){	
	            			$window.alert(_getMsg("msg.label.apprvalue") + _getMsg("msg.input"));	
		            		return false;
		            		break;
	            		}
	               	}
	            	if($scope.widget.ofd_type == 'B'){
		            	if(frm.appn_value1.$invalid){
		            		$window.alert("유효한 " + _getMsg("msg.label.apprvalue1") + _getMsg("msg.input"));
		            		return false;
		            		break;
		               	}	            		
		            	if(frm.appn_value2.$invalid){
		            		$window.alert("유효한 " + _getMsg("msg.label.apprvalue2") + _getMsg("msg.input"));
		            		return false;
		            		break;
		               	}		            	
	            	}
	            	if(frm.appn_text.$invalid){
	            		$window.alert(_getMsg("msg.label.appntext") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}	
	            	if(frm.noappn_text.$invalid){
	            		$window.alert(_getMsg("msg.label.noappntext") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}					            	
		        }	
			 	if($scope.widget.ofd_type == 'B'){
	            	if(isNaN($scope.widget.appn_value1)){
	            		$window.alert("수치형 " + _getMsg("msg.label.apprvalue1") + _getMsg("msg.input"));
	            		return false;
	            		break;	            		
	            	}
	            	if(isNaN($scope.widget.appn_value2)){
	            		$window.alert("수치형 " + _getMsg("msg.label.apprvalue2") + _getMsg("msg.input"));
	            		return false;
	            		break;	            		
	            	}
	            	if(parseFloat($scope.widget.appn_value1) > parseFloat($scope.widget.appn_value2)){
	            		$window.alert(_getMsg("msg.label.apprvalue1") + ", " + _getMsg("msg.label.apprvalue2") + "을 확인하세요");
	            		return false;
	            		break;
	            	}					            	
			 	}
	        	break;		
	     	case 'sts':
				var frm = $scope.fm_sts;					
			 	if (!frm.$valid) {				 		
	            	if(frm.input_widg_nm.$invalid){
	            		$window.alert(_getMsg("msg.label.name") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}           	
	            	if(frm.appn_value1.$invalid){
	            		$window.alert("유효한 " + _getMsg("msg.label.apprvalue1") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}	            		
	            	if(frm.appn_value2.$invalid){
	            		$window.alert("유효한 " + _getMsg("msg.label.apprvalue2") + _getMsg("msg.input"));
	            		return false;
	            		break;
	               	}		            	
            		if(frm.appn_value3.$invalid){	
            			$window.alert(_getMsg("msg.label.apprvalue3") + _getMsg("msg.input"));	
	            		return false;
	            		break;
            		}	            	
		        }	
            	if($scope.chkDeviceItem.length < 1){
            		$window.alert(_getMsg("msg.label.device") + _getMsg("msg.select"));
            		return false;
            		break;
               	}		
            	if($scope.chkDeviceItem.length > 6){
            		$window.alert(_getMsg("msg.label.device") + "는 최대 6개 까지 등록가능합니다.");
            		return false;
            		break;
               	}	            	
            	if(isNaN($scope.widget.appn_value1)){
            		$window.alert("수치형 " + _getMsg("msg.label.apprvalue1") + _getMsg("msg.input"));
            		return false;
            		break;	            		
            	}
            	if(isNaN($scope.widget.appn_value2)){
            		$window.alert("수치형 " + _getMsg("msg.label.apprvalue2") + _getMsg("msg.input"));
            		return false;
            		break;	            		
            	}
            	if(parseFloat($scope.widget.appn_value1) > parseFloat($scope.widget.appn_value2)){
            		$window.alert(_getMsg("msg.label.apprvalue1") + ", " + _getMsg("msg.label.apprvalue2") + "을 확인하세요");
            		return false;
            		break;
            	}					            	
	        	break;		        	
	     	default:
	         	break;
		} 
		return true;
	}					
	
	// 삭제
	$scope.fDelete = function(){
		$scope.commonVO.gbn = "D";	    					
		$scope.fSave();				 	
	}

	// 취소
	$scope.fCancel = function(){
		$scope.commonVO.gbn = "";	    
		$scope.schTxt = "";
		_popupHideAll();				 	
	}
	
	// 취소서브
	$scope.fCancelSub = function(id){    					
		_popupHide(id);				 	
	}			
	
	
	// 조회기간 변경
   	$scope.fAccDate = function(sel, idx) {
   		$scope.dbList[idx].actvty_time_ty = sel;
   		$scope.dbLoadList[idx] = true;
		$http({
			method		: 'GET',
			url      	: '/chs/dashboardRefresh.json',
			params      : {"data":$scope.dbList[idx]}					
		})
		.success(function(data, status, headers, config){
			$scope.dtlList[idx] = data.dtlList;
			if($scope.dbList[idx].widg_knd == 'act'){
				$scope.fChartDataUpdate(idx);
			}
			$scope.dbLoadList[idx] = false;
		})
		.error(function(data, status, headers, config){
			$window.alert(_getMsg("msg.error.reset"));
			$scope.dbLoadList[idx] = false;
		}); 			   		
   		
    }
   	
   	// 이력차트 셋팅
	$scope.fHisChartSet = function(){
        angular.forEach($scope.dbList,function(value,index){
    		$scope.dbList[index]["hpage"] = $scope.hpage_size;
        });
	}		   					
		
	// 이력 더보기
	$scope.fHisMore = function(idx){	
		$http({
			method		: 'GET',
			url      	: '/chs/dashboardHistoryCount.json',
			params      : {"data":$scope.dbList[idx]}					
		})
		.success(function(data, status, headers, config){
			var hcnt = data.hcnt;
			if(hcnt > $scope.dbList[idx].hpage){
				$scope.dbList[idx].hpage = $scope.dbList[idx].hpage + $scope.hpage_size; 
				$http({
					method		: 'GET',
					url      	: '/dashboard/dashboardRefresh.json',
					params      : {"data":$scope.dbList[idx]}					
				})
				.success(function(data, status, headers, config){
					$scope.dtlList[idx] = data.dtlList;						
				})
				.error(function(data, status, headers, config){
					$window.alert(_getMsg("msg.error.inq"));
				});  
			}else{
				$window.alert(_getMsg("msg.label.history") + _getMsg("msg.nomore"));
			}						
		})
		.error(function(data, status, headers, config){			
			$window.alert(_getMsg("msg.error.inq"));
		}); 												 	
	}

	// 위젯 정렬
	$scope.fDbOrdReset = function(){
		$scope.dragRow = '';
		$scope.dragCol = '';
		$http({
			method		: 'POST',
			url      	: '/chs/dashboardOrder.json',
        	headers     : {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},                        
        	data        : $httpParamSerializerJQLike({"data": angular.toJson($scope.dbList)})                                                					
		})
		.success(function(data, status, headers, config){
		   	if(data.result != "ok") {
		   		$window.alert(_getMsg("msg.label.dashboard") + " 이동" + _getMsg("msg.error.ing"));
		   	}												
		})
		.error(function(data, status, headers, config){
	   		$window.alert(_getMsg("msg.label.dashboard") + " 이동" + _getMsg("msg.error.ing"));						
		}); 						
	}
	
	// 위젯 디바이스 변경
	$scope.fDvcChange = function(){
		$http({
			method		: 'GET',
			url      	: '/dashboard/dashboardDeviceChange.json',
			params      : {"device_no":$scope.widget.device_no}					
		})
		.success(function(data, status, headers, config){
			$scope.objList2 = data.list;
		})
		.error(function(data, status, headers, config){			
			$window.alert(_getMsg("msg.error.inq"));
		}); 		
	}			
	
	// 위젯 센서 변경
	$scope.fSensorChange = function(){
		$scope.chkOneItem = {item: ''};
		$scope.chkMultiItem = [];
		$http({
			method		: 'GET',
			url      	: '/chs/dashboardSensorChange.json',
			params      : {"sensor_no":$scope.widget.sensor_no}					
		})
		.success(function(data, status, headers, config){
			$scope.objList3 = data.list;
		})
		.error(function(data, status, headers, config){			
			$window.alert(_getMsg("msg.error.inq"));
		}); 		
	}
	
	// 위젯 On/Off 변경
	$scope.fOfdChange = function(){
		if($scope.widget.ofd_type == "A"){
			$scope.widget.appn_value2 = "";
		}
	}	
	
	// 위젯 On/Off keyup
	$scope.fOfdKeypress = function(type){
		if (!(event.keyCode >=37 && event.keyCode<=40)) {
			var regexp = /[^0-9.\-]/;
			if(type=='min'){
				var value = $("#appn_value1").val();
				$scope.widget.appn_value1 = angular.copy(value.replace(regexp, ''));				
			}
			if(type=='max'){
				var value = $("#appn_value2").val();
				$scope.widget.appn_value2 = angular.copy(value.replace(regexp, ''));				
			}			
		}
	}
	
	//차트 데이터 처리	
	$scope.fChartDataUpdate = function(idx){
		angular.forEach($scope.itemList[idx],function(value,index){
    		if(value.sn == $scope.itemChoiseList[idx]){
    			$scope.dbNoData[idx] = false;
    			$scope.$broadcast('amCharts.updateData', $scope.dtlList[idx][index], 'chart-'+idx);	
    		}
        });				
	}	

		
	$scope.dragRow = '';
	$scope.dragCol = '';						
	$scope.gridsterOpts = {
	    columns: 4,
	    //margins: [15, 15],
	    outerMargin: false,				    
		swapping: true,
		pushing: true,
		floating: true,
	    //width: 'auto', 
		//colWidth: 'auto',
	    rowHeight: 360, // 'match'
	    isMobile: false, 
	    //mobileBreakPoint: 600,
		//mobileModeEnabled: true,
	    defaultSizeX: 1,
	    defaultSizeY: 1,
	    minSizeX: 1,
	    maxSizeX: 3,
	    minSizeY: 1,
	    maxSizeY: 1,					    
	    resizable: {
	        enabled: false
	    },						
		draggable: {
	    	enabled: true,
            start: function(event, $element, $widget) 
            {
            	$scope.dragRow = $widget.row;
            	$scope.dragCol = $widget.col;	                    	
            },				
	    	stop: function(event, $element, $widget, ui) {
	    		var before = $scope.dragRow+":"+$scope.dragCol;
	    		var after =  $widget.row+":"+$widget.col;
	    		if(before!=after){
		    		$scope.fDbOrdReset();
	    		}
	    	} 
		}	     
	};
		
	//실시간 차트 불러오기
	$scope.fRefreshRct = function(idx){
		$scope.request = true;
		$http({
			method		: 'GET',
			url      	: '/chs/dashboardRefresh.json',
			params      : {"data":$scope.dbList[idx]}					
		})
		.success(function(data, status, headers, config){
			$scope.request = false;
			$scope.dtlList[idx] = data.dtlList;
			$scope.fChartDataUpdate(idx);			
		})
		.error(function(data, status, headers, config){
			$scope.request = false;
		});  					 	
	}		
	
	//새로고침
	$scope.fRefreshRealTime = function(idx){	
		if($scope.dbList[idx].widg_knd != 'rct'){
			$scope.dbLoadList[idx] = true;
		}
		$scope.request = true;
		$http({
			method		: 'GET',
			url      	: '/chs/dashboardRefresh.json',
			params      : {"data":$scope.dbList[idx]}					
		})
		.success(function(data, status, headers, config){
			$scope.dtlList[idx] = data.dtlList;		
			if($scope.dbList[idx].widg_knd == 'rct'){
				$scope.fChartDataUpdate(idx);				
			}				
			
			// 상태정보 위젯 셋팅
			if($scope.dbList[idx].widg_knd == 'sts'){
				$scope.fStsSetting(idx);
				$scope.$broadcast('amCharts.updateData', $scope.dtlList[idx], 'chart-'+idx);
			}
			
			$scope.dbLoadList[idx] = false;
			$scope.request = false;
		})
		.error(function(data, status, headers, config){	
//			$window.alert(_getMsg("msg.error.reset"));
			$scope.dbLoadList[idx] = false;
			$scope.request = false;
		});  					 	
	}		
	
	
	
	// 차등 조회 Interval Function 
	$scope.fInterval = function(idx){
		if(!$scope.request){
			$scope.fRefreshRealTime(idx);				
		}else{
			$scope.interval2[idx] = $interval(function(){
				if(!$scope.request){
					$scope.fRefreshRealTime(idx);
                   	$interval.cancel($scope.interval2[idx]);
                   	$scope.interval2[idx] = null;
				}    			
			}, 500);			
		}
	}
					
	// 실시간 조회 Interval Function
	$scope.fUpdateProc = function(idx){	
		if($scope.interval[idx] != null ){
			$interval.cancel($scope.interval[idx]);		    			
			$scope.interval[idx] = null;
		}
		
		if( $scope.updateFlag[idx].status == true ){
			$scope.interval[idx] = $interval(function(){
    			if( $scope.updateFlag[idx].status == true ){    				
   					$scope.fInterval(idx);	
    			}else{
    				if( $scope.interval[idx] != null ){	
    					$interval.cancel($scope.interval[idx]);
    					$scope.interval[idx] = null;
    	    		}
    			}		        			 
			}, 60000);
		}
	};	
	
	// 실시간 조회 변경
	$scope.fUpdateAuto = function(idx){	
		$scope.updateFlag[idx].status = !$scope.updateFlag[idx].status;	
		$scope.fUpdateProc(idx);
	};		
	
	// No Data 셋팅
	$scope.fNodataSet = function(idx){
		$scope.dbNoData[idx] = true;
	}
	    
	$scope.fDashboardWidth = function(){ 
		$scope.gridsterOpts.width = angular.element(document.getElementById('dashboardMain')).prop('offsetWidth');
		$scope.$apply();
	}
	//잔량 퍼센트 계산
	$scope.calPercent = function(capacity, remainder){
		var percent = (remainder / capacity) * 100;
		if(percent % 1 != 0) percent = percent.toFixed(2);
		return percent;
	}
	//상태 정보 체크
	$scope.calStatus = function(){
		var currentTime = Date.now();
		var standardTime = 24 * 3600 * 1000;
		if(currentTime - $scope.statusTime > standardTime){
			$scope.statusCheck = "fail";
		}else{
			$scope.statusCheck = "ok";
		}
	}
	//벨브 잔량 초기화
	$scope.resetUsage = function(index){
		console.log("초기화 : "  +index);
		console.log("밸브 아이디 : "  +  $scope.dbList[index].sequence);
		 $http({
             method: 'PUT',
             url: '/chs/dispensers/'+$scope.curDispenserId+'/valves/'+$scope.dbList[index].sequence+'/reset',
             headers		: {
				'Content-Type': 'application/json'
			 },
         })
		 .success(function (data, status, headers) 
		 {
			_loading.hide();
			$window.alert(_getMsg("msg.complete.edit"));
	  	}).error(function(data, status, headers, config){
	  		_loading.hide();
			$window.alert(_getMsg("msg.error"));
    	});
	}
	
	//상태 체크
	$scope.checkStatus = function(){
		alert("디스펜서 아이디 "  +  $scope.curDispenserId);
	}
	
	angular.element($window).on('resize', function () {
		$scope.fDashboardWidth();
	});
	
	//배터리
	 function updateBattery(type, perc){
	    	console.log("type : " + type);
	    	console.log("perc : " + perc);
	        if(perc === 100){
	            $scope.sArray = [];
	        } else if($scope.sArray.length === 0){
	            $scope.sArray = [4, 6, 8, 10];
	        }

	        changeStylesheetRule($scope.s, '#battery-'+type, 'backgroundPosition', '0 -' + (100 - perc) + '% !important');
	        changeStylesheetRule($scope.s, '.battery-text', 'backgroundPosition', '0 -' + (100 - perc) + '%');
	        changeStylesheetRule($scope.s, '#liquid-'+type, 'top', (100 - perc) + '%');
	        if(perc === 100){
	            changeStylesheetRule($scope.s, '.liquid-bg-color', 'backgroundColor', '#00fa57');
	        } else {
	            changeStylesheetRule($scope.s, '.liquid-bg-color', 'backgroundColor', '#444');
	        }
	    }
	
	
	
	
	
	function changeStylesheetRule(s, selector, property, value){
	    // Make these strings lowercase
	    selector = selector.toLowerCase();
	    value    = value.toLowerCase();

	    // Delete it if it exists
	    for(var i = 0; i < s.cssRules.length; i++){
	        var rule = s.cssRules[i];
	        if(rule.selectorText === selector){
	            s.deleteRule(i);
	            break;
	        }
	    }

	    // Convert camelCase to hyphenated-case
	    property = property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	    s.insertRule(selector + " { " + property + ": " + value + "; }", 0);
	}

	// Function to select random array element
	// Used within the setInterval()
	function randomValue(arr){
	    return arr[Math.floor(Math.random() * arr.length)];
	}

	jQuery.easing['jswing'] = jQuery.easing['swing'];
	jQuery.extend(jQuery.easing, {
	    def: 'easeOutQuad',
	    swing: function (x, t, b, c, d){
	        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	    },
	    easeOutQuad: function (x, t, b, c, d){
	        return -c * (t /= d) * (t - 2) + b;
	    },
	});

	$(document).ready(function(){
	    //var s = document.styleSheets[0];
	    // Define a size array, this will be used to vary bubble sizes
	    //var sArray = [];


	    // setInterval function used to create new bubble every 350 milliseconds
	    setInterval(function(){
	        if($scope.sArray.length > 0){
	            // Get a random size, defined as variable so it can be used for both width and height
	            var size = randomValue($scope.sArray);

	            var largestSize = Math.max.apply(Math, $scope.sArray);
	            var offset = largestSize / 2; // half to get the largest bubble radius
	            offset += 5; // 5px for border-right

	            // New bubble appended to div with it's size and left position being set inline
	            $('.bubbles').each(function(){
	                var bArray = new Array(parseInt($(this).width()) - offset)
	                                 .join()
	                                 .split(',')
	                                 .map(function(item, index){ return ++index; });

	                $(this).append('<div class="individual-bubble" style="left: ' + randomValue(bArray) + 'px; width: ' + size + 'px; height: ' + size + 'px"></div>');
	            });

	            // Animate each bubble to the top (bottom 100%) and reduce opacity as it moves
	            // Callback function used to remove finished animations from the page
	            $('.individual-bubble').animate({
	                'top': 0,
	                'bottom': '100%',
	                'opacity' : '-=0.7',
	            }, 3000, function(){
	                $(this).remove();
	            });
	        }
	    }, 350);

	});
	
});

