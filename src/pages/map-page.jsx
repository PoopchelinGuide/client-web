import React from 'react';
import { useEffect } from 'react';
import '../styles/map-style.css';
import Navigatorbar from '../components/navigatorbar';

const { Tmapv2 } = window;

function MapPage() {
  var map;
  var marker_s, marker_e, marker_p1, marker_p2;
  var totalMarkerArr = [];
	var drawInfoArr = [];
	var resultdrawArr = [];


  // 3. 경로탐색 API 사용요청

	
	function drawLine(arrPoint) {
		var polyline_;

		polyline_ = new Tmapv2.Polyline({
      strokeStyle: "solid",
			path : arrPoint,
			strokeColor : "yellow",
			strokeWeight : 15,
      outline : true,
      outlineColor: "pink",
      direction : true,
      directionColor : "orange",
      directionOpacity : 0.7,
			map : map,
		});
		resultdrawArr.push(polyline_);
	}



  function ininTMap() {


    var mapContainer = document.getElementById('map_div'), // 지도를 표시할 div 
    
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption); 


    // const mapDiv = document.getElementById('map_div');

    // // map_div가 이미 존재하면 초기화하지 않음
    // if (!mapDiv.firstChild) {
    //   map = new Tmapv2.Map('map_div', {
    //     center: new window.Tmapv2.LatLng(
    //       37.566481622437934,
    //       126.98502302169841
    //     ),
    //     zoom: 17,
    //   });
    // }

    // // 2. 시작, 도착 심볼찍기
		// // 시작
    // marker_s = new Tmapv2.Marker(
    //   {
    //     position : new Tmapv2.LatLng(37.566481622437934,126.98502302169841),
    //     // icon : "/upload/tmap/marker/pin_r_m_s.png",
    //     iconSize : new Tmapv2.Size(24, 38),
    //     map : map
    //   });

    // // 도착
    // marker_e = new Tmapv2.Marker(
    //   {
    //     position : new Tmapv2.LatLng(37.567158,126.989940),
    //     // icon : "/upload/tmap/marker/pin_r_m_e.png",
    //     iconSize : new Tmapv2.Size(24, 38),
    //     map : map
    //   });

    //   var headers = {}; 
	  //   headers["appKey"]="WGYNvwAqWq4x558TZehlb6jhhx1uwVaA71adQni8";

    //   fetch("https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
    //   {
		// 		method : "POST",
		// 		headers : headers,
    //     body: JSON.stringify({
    //       "startX": "126.98502302169841",
    //       "startY": "37.566481622437934", // 
    //       "endX": "126.989940",
    //       "endY": "37.567158",
    //       "reqCoordType": "WGS84GEO",
    //       "resCoordType": "EPSG3857",
    //       "startName": "출발지",
    //       "endName": "도착지"
    //     })
    //   })
    //     .then(response => response.json()) // 응답을 JSON으로 변환
    //     .then(response => {
		// 			var resultData = response.features;

		// 			//결과 출력
		// 			var tDistance = "총 거리 : "
		// 					+ ((resultData[0].properties.totalDistance) / 1000)
		// 							.toFixed(1) + "km,";

		// 			var tTime = " 총 시간 : "
		// 					+ ((resultData[0].properties.totalTime) / 60)
		// 							.toFixed(0) + "분";

		// 			console.log(tDistance + tTime);
					
		// 			//기존 그려진 라인 & 마커가 있다면 초기화
		// 			if (resultdrawArr.length > 0) {
		// 				for ( var i in resultdrawArr) {
		// 					resultdrawArr[i]
		// 							.setMap(null);
		// 				}
		// 				resultdrawArr = [];
		// 			}
					
		// 			drawInfoArr = [];

		// 			for ( var i in resultData) { //for문 [S]
		// 				var geometry = resultData[i].geometry;
		// 				var properties = resultData[i].properties;
		// 				var polyline_;

		// 				if (geometry.type == "LineString") {
		// 					for ( var j in geometry.coordinates) {
		// 						// 경로들의 결과값(구간)들을 포인트 객체로 변환 
		// 						var latlng = new Tmapv2.Point(
		// 								geometry.coordinates[j][0],
		// 								geometry.coordinates[j][1]);
		// 						// 포인트 객체를 받아 좌표값으로 변환
		// 						var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
		// 								latlng);
		// 						// 포인트객체의 정보로 좌표값 변환 객체로 저장
		// 						var convertChange = new Tmapv2.LatLng(
		// 								convertPoint._lat,
		// 								convertPoint._lng);
		// 						// 배열에 담기
		// 						drawInfoArr.push(convertChange);
		// 					}
		// 				} else {
		// 					var markerImg = "";
		// 					var pType = "";
		// 					var size;

		// 					if (properties.pointType == "S") { //출발지 마커
		// 						// markerImg = "/upload/tmap/marker/pin_r_m_s.png";
		// 						pType = "S";
		// 						size = new Tmapv2.Size(24, 38);
		// 					} else if (properties.pointType == "E") { //도착지 마커
		// 						// markerImg = "/upload/tmap/marker/pin_r_m_e.png";
		// 						pType = "E";
		// 						size = new Tmapv2.Size(24, 38);
		// 					} else { //각 포인트 마커
		// 						// markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
		// 						pType = "P";
		// 						size = new Tmapv2.Size(8, 8);
		// 					}

		// 					// 경로들의 결과값들을 포인트 객체로 변환 
		// 					var latlon = new Tmapv2.Point(
		// 							geometry.coordinates[0],
		// 							geometry.coordinates[1]);

		// 					// 포인트 객체를 받아 좌표값으로 다시 변환
		// 					var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
		// 							latlon);

		// 					var routeInfoObj = {
		// 						markerImage : markerImg,
		// 						lng : convertPoint._lng,
		// 						lat : convertPoint._lat,
		// 						pointType : pType
		// 					};

		// 					// // Marker 추가
		// 					// marker_p = new Tmapv2.Marker(
		// 					// 		{
		// 					// 			position : new Tmapv2.LatLng(
		// 					// 					routeInfoObj.lat,
		// 					// 					routeInfoObj.lng),
		// 					// 			icon : routeInfoObj.markerImage,
		// 					// 			iconSize : size,
		// 					// 			map : map
		// 					// 		});
		// 				}
		// 			}//for문 [E]
		// 			drawLine(drawInfoArr);
		// 		})
    //     .catch(error => {
    //       console.error("Error:", error);
    //       // 에러 처리 로직은 여기에 작성합니다.
		// 		});



      


  }
  useEffect(() => {
    ininTMap();
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
