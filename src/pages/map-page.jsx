import React from 'react';
import { useEffect } from 'react';
import '../styles/map-style.css';
import Navigatorbar from '../components/navigatorbar';

const { Tmapv2 } = window;
const { kakao } = window;

function MapPage() {
  var map;
  var marker_s, marker_e, marker_p1, marker_p2;
  var polyline_ = null; // 현재 폴리라인을 저장할 변수

  var totalMarkerArr = [];
	var drawInfoArr = [];
	var resultdrawArr = [];



// 보행자 경로 그리기 함수
function drawLine(arrPoint) {
	


    var points = [];
    arrPoint.forEach((element) => {
      points.push(new kakao.maps.LatLng(element._lat, element._lng));
    })

	// 기존 폴리라인이 있으면 지도에서 제거
	if (polyline_ !== null) {
		polyline_.setMap(null);
	}


    // 지도에 표시할 선을 생성합니다
    polyline_ = new kakao.maps.Polyline({
      path: points, // 선을 구성하는 좌표배열 입니다
      strokeWeight: 10, // 선의 두께 입니다
      strokeColor: '#FFAE00', // 선의 색깔입니다
      strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: 'solid' // 선의 스타일입니다
});

  // 지도에 선을 표시합니다 
  polyline_.setMap(map); 
  // resultdrawArr.push(polyline_);
	}

  function initKakaoMap(locPosition) {

    var mapContainer = document.getElementById('map_div'), // 지도를 표시할 div 

    mapOption = { 
        center: locPosition, // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

	if (!mapContainer.firstChild) {
    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    map = new kakao.maps.Map(mapContainer, mapOption); 
	}


    // const mapDiv = document.getElementById('map');

    // // map_div가 이미 존재하면 초기화하지 않음
    // if (!mapDiv.firstChild) {
    //   map2 = new Tmapv2.Map('map_div', {
    //     center: new window.Tmapv2.LatLng(
    //       37.566481622437934,
    //       126.98502302169841
    //     ),
    //     zoom: 17,
    //   });
    // }

  }

function routeNavigation(locPosition, lat, lon){
    // 2. 시작, 도착 심볼찍기

    marker_s = new kakao.maps.Marker(
		{
		  position : locPosition,
		  // icon : "/upload/tmap/marker/pin_r_m_s.png",
		  iconSize : new kakao.maps.Size(24, 38),
		  map : map
		});
  
	  // 도착
	  marker_e = new kakao.maps.Marker(
		{
		  position : new kakao.maps.LatLng(37.53822193303926,127.12627274769703),
		  // icon : "/upload/tmap/marker/pin_r_m_e.png",
		  iconSize : new kakao.maps.Size(24, 38),
		  map : map
		});

		var headers = {}; 
		  headers["appKey"]="WGYNvwAqWq4x558TZehlb6jhhx1uwVaA71adQni8";
  
		fetch("https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
		{
			method : "POST",
			headers : headers,
		  	body: JSON.stringify({
				"startX": lon.toString(),
				"startY": lat.toString(), // 
				"endX": "128.5967954",
				"endY": "35.8678658",
				"reqCoordType": "WGS84GEO",
				"resCoordType": "EPSG3857",
				"startName": "출발지",
				"endName": "도착지"
		  })
		})
		  .then(response => response.json()) // 응답을 JSON으로 변환
		  .then(response => {
					  var resultData = response.features;
  
					  //결과 출력
					  var tDistance = "총 거리 : "
							  + ((resultData[0].properties.totalDistance) / 1000)
									  .toFixed(1) + "km,";
  
					  var tTime = " 총 시간 : "
							  + ((resultData[0].properties.totalTime) / 60)
									  .toFixed(0) + "분";
  
					  console.log(tDistance + tTime);
					  
					  //기존 그려진 라인 & 마커가 있다면 초기화
					  if (resultdrawArr.length > 0) {
						  for ( var i in resultdrawArr) {
							  resultdrawArr[i]
									  .setMap(null);
						  }
						  resultdrawArr = [];
					  }
					  
					  drawInfoArr = [];
  
					  for ( var i in resultData) { //for문 [S]
						  var geometry = resultData[i].geometry;
						  var properties = resultData[i].properties;
						  var polyline_;
  
						  if (geometry.type == "LineString") {
							  for ( var j in geometry.coordinates) {
								  // 경로들의 결과값(구간)들을 포인트 객체로 변환 
								  var latlng = new Tmapv2.Point(
										  geometry.coordinates[j][0],
										  geometry.coordinates[j][1]);
								  // 포인트 객체를 받아 좌표값으로 변환
								  var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
										  latlng);
								  // 포인트객체의 정보로 좌표값 변환 객체로 저장
								  var convertChange = new Tmapv2.LatLng(
										  convertPoint._lat,
										  convertPoint._lng);
								  // 배열에 담기
								  drawInfoArr.push(convertChange);
							  }
						  } else {
							  var markerImg = "";
							  var pType = "";
							  var size;
  
							  if (properties.pointType == "S") { //출발지 마커
								  // markerImg = "/upload/tmap/marker/pin_r_m_s.png";
								  pType = "S";
								  size = new kakao.maps.Size(24, 38);
							  } else if (properties.pointType == "E") { //도착지 마커
								  // markerImg = "/upload/tmap/marker/pin_r_m_e.png";
								  pType = "E";
								  size = new kakao.maps.Size(24, 38);
							  } else { //각 포인트 마커
								  // markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
								  pType = "P";
								  size = new kakao.maps.Size(8, 8);
							  }
  
							  // 경로들의 결과값들을 포인트 객체로 변환 
							  var latlon = new Tmapv2.Point(
									  geometry.coordinates[0],
									  geometry.coordinates[1]);
  
							  // 포인트 객체를 받아 좌표값으로 다시 변환
							  var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
									  latlon);
  
							  var routeInfoObj = {
								  markerImage : markerImg,
								  lng : convertPoint._lng,
								  lat : convertPoint._lat,
								  pointType : pType
							  };
  
							  // // Marker 추가
							  // marker_p = new Tmapv2.Marker(
							  // 		{
							  // 			position : new Tmapv2.LatLng(
							  // 					routeInfoObj.lat,
							  // 					routeInfoObj.lng),
							  // 			icon : routeInfoObj.markerImage,
							  // 			iconSize : size,
							  // 			map : map
							  // 		});
						  }
					  }//for문 [E]
					  drawLine(drawInfoArr);
				  })
		  .catch(error => {
			console.error("Error:", error);
			// 에러 처리 로직은 여기에 작성합니다.
				  });

}


function asd(){
    // 위치 정보를 가져오는 함수
    const getLocation = new Promise((resolve) => {
		if (navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(
			function (position) {
			  var lat = position.coords.latitude,
				  lon = position.coords.longitude;
			  var locPosition = new kakao.maps.LatLng(lat, lon);
			  resolve(locPosition);
			  console.log("현재위치를 가져옵니다.");
			},
			function () {
			  var locPosition = new kakao.maps.LatLng(35.8678658, 128.5967954);
			  resolve(locPosition);
			  console.log("현재위치를 가져올 수 없습니다.");
			}
		  );
		} else {
		  var locPosition = new kakao.maps.LatLng(35.8678658, 128.5967954);
		  resolve(locPosition);
		  console.log("현재위치를 가져올 수 없습니다.");
		}
	  });

	      // 위치 정보를 가져온 후에 지도를 초기화하는 함수
		  getLocation.then((locPosition) => {
			initKakaoMap(locPosition);
			console.log("가져온 위치 정보로 지도를 초기화합니다.");
		  });

		      // 사용자 위치를 지속적으로 추적
			  let watchId = navigator.geolocation.watchPosition(
				(position) => {
				  var lat = position.coords.latitude,
					lon = position.coords.longitude;
				  var locPosition = new kakao.maps.LatLng(lat, lon);
		  
				  // 이전 위치 마커가 있으면 지도에서 제거
				  if (marker_s) {
					marker_s.setMap(null);
				  }
		  
				  // 사용자의 위치에 마커 표시
				  marker_s = new kakao.maps.Marker({
					map: map,
					position: locPosition,
				  });
				  routeNavigation(locPosition, lat, lon);

				  console.log("사용자의 위치를 지속적으로 추적합니다.");
				},
				(error) => {
				  console.log(error);
				},
				{
				  enableHighAccuracy: true,
				  maximumAge: 0,
				  timeout: Infinity,
				}
			  );

			  // 컴포넌트가 unmount될 때 위치 추적을 중지
    			return () => navigator.geolocation.clearWatch(watchId);
			}



  useEffect(() => {
	asd();
  }, []); // pageId가 변경될 때마다 이 효과가 실행되도록 합니다.

  return (
    <>
      <div
        id="map_div"
      ></div>
      {Navigatorbar()}
    </>
  );
}

export default MapPage;
