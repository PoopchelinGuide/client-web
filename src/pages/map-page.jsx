import React from 'react';
import { useEffect, useState } from 'react';
import '../styles/map-style.css';
import { useNavigate } from 'react-router-dom';

import imageSrc from "../markerImage/Toilet.png";
import imageSrc2 from "../markerImage/ToiletChoice.png";
import imageSrc3 from "../markerImage/iconBlue.png";
import imageSrc4 from "../markerImage/iconRed.png";
import '../styles/app-style.css';

import { CloseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Card, Rate, Tag, message , Button, Divider , FloatButton, Empty } from "antd";

const { Tmapv2 } = window;
const { kakao } = window;

function MapPage() {
  const navigate = useNavigate();

  const array = [
    // {
    //   title: '화장실이 깨끗해요',
    //   tag: ['깨끗해요', '좋아요'],
    //   date: '2024-04-29',
    //   nickname : '보땡이',
    //   rate : 4.5,
    // },
    // {
    //   title: '휴지가 가끔 없어요',
    //   tag: ['휴지 없음'],
    //   date: '2024-04-27',
    //   nickname : '보땡이',
    //   rate : 4.5,
    // },
];

  var map;
  var marker_s, marker_e, marker_p1, marker_p2;

  var markers = []; // 마커를 담을 배열
  var markerList = [], // 마커 정보를 담은 배열
    selectedMarker = null; // 클릭한 마커를 담을 변수
  let prevInfo = null; // 이전에 열린 팝업 정보를 저장하는 변수

  var polyline_ = null; // 현재 폴리라인을 저장할 변수
  let [popupInfo, setPopupInfo] = useState(null); // 현재 열려있는 팝업 정보를 저장하는 변수, boolean

  var imageSize = new kakao.maps.Size(70, 70); // 마커의 크기 기존 42, 56
  var choiceImageSize = new kakao.maps.Size(90, 90); // 선택한 마커의 크기 기존 44, 58
  
  var clickImage = createMarkerImage(imageSrc2, choiceImageSize),
  	normalImage = createMarkerImage(imageSrc, imageSize),
	garbegeImage = createMarkerImage(imageSrc3, imageSize),
	garbegeClickImage = createMarkerImage(imageSrc4, choiceImageSize);

  var clickImage = createMarkerImage(
      imageSrc2,
      choiceImageSize
    ),
    normalImage = createMarkerImage(imageSrc, imageSize);

  var totalMarkerArr = [];
  var drawInfoArr = [];
  var resultdrawArr = [];

  // MakrerImage 객체를 생성하여 반환하는 함수입니다
  function createMarkerImage(markerScr, markerSize) {
    var markerImage = new kakao.maps.MarkerImage(
      markerScr,
      markerSize
    );
    return markerImage;
  }

  // fetch 통신 method
  const fetchData = async (
    circleXY,
    latlng,
    initMarkers
  ) => {
    try {
      const response = await fetch(
        // `http://192.168.0.22/toilet/range?x1=${circleXY.minX}&x2=${circleXY.maxX}&y1=${circleXY.minY}&y2=${circleXY.maxY}`,
		`http://192.168.0.96/toilet/range?x1=${circleXY.minX}&x2=${circleXY.maxX}&y1=${circleXY.minY}&y2=${circleXY.maxY}`,
        {
          method: 'GET',
        }
      );
      if (response.status === 200) {
        markerList = await response.json();
        console.log('데이터 전송 완료');

        var garbageBin = markerList.garbageBin;
        var toilet = markerList.toilet;
        console.log(garbageBin);
        console.log(toilet);
        initMarkers();
      } else if (response.status === 400) {
        message.error("화장실이 존재하지 않습니다.", 2);
      }
    } catch (error) {
      message.error("잘못된 요청입니다.");
      console.error('오류 발생:', error);
    }
  };

   // fetch 통신 method
   const fetchData2 = async (
    circleXY,
    latlng,
    initMarkers
  ) => {
    try {
      const response = await fetch(
        `http://192.168.0.22/toilet/range?x1=${circleXY.minX}&x2=${circleXY.maxX}&y1=${circleXY.minY}&y2=${circleXY.maxY}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        const { data } = await response.json();
        // 서버에서 받은 데이터를 markerList에 저장
        markerList = data;
        console.log('데이터 전송 완료');
        console.log(markerList);
        initMarkers();
      } else if (response.status === 400) {
        message.error("화장실이 존재하지 않습니다.", 2);
      }
    } catch (error) {
      message.error("잘못된 요청입니다.");
      console.error('오류 발생:', error);
    }
  };

  //Popup창 켜고 끄는 method
  function showPopup(info) {
    console.log('팝업창을 띄웁니다.');
    // 현재 열린 팝업 정보가 null이 아니고, 새로운 팝업이 이전 팝업과 같다면 팝업을 닫고 함수를 종료합니다.
    if (prevInfo !== null && prevInfo === info) {
      prevInfo = null;
      setPopupInfo(prevInfo);
      return;
    }

    // 그렇지 않은 경우, 즉 현재 열린 팝업이 없거나 새로운 팝업이 이전 팝업과 다르다면
    // 현재 열린 팝업 정보를 새로운 팝업 정보로 업데이트합니다
    prevInfo = info;
    setPopupInfo(prevInfo);
  }

  function initMarkers() {
    if (markerList === null) {
      console.log('데이터가 없습니다.');
      return;
    }
    markerList.forEach(function (markerInfo) {
      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(
          markerInfo.storeLocationY,
          markerInfo.storeLocationX
        ),
        map: map,
        image: normalImage, // 마커 이미지
      });
      marker.normalImage = normalImage;
      marker.clickImage = clickImage;

      markers.push(marker);

      // 마커에 click 이벤트를 등록합니다
      kakao.maps.event.addListener(
        marker,
        'click',
        function () {
          // 클릭된 마커가 없거나, click 마커가 클릭된 마커가 아니면
          // 마커의 이미지를 클릭 이미지로 변경합니다

          if (
            !selectedMarker ||
            selectedMarker !== marker
          ) {
            // 클릭된 마커 객체가 null이 아니면
            // 클릭된 마커의 이미지를 기본 이미지로 변경하고
            !!selectedMarker &&
              selectedMarker.setImage(
                selectedMarker.normalImage
              );

            // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
            marker.setImage(marker.clickImage);
            // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
            selectedMarker = marker;
          } else if (selectedMarker === marker) {
            selectedMarker.setImage(
              selectedMarker.normalImage
            );
            selectedMarker = null;
          }
          showPopup('a');
        }
      );
    });
  }

  // 보행자 경로 그리기 함수
  function drawLine(arrPoint) {
    var points = [];
    arrPoint.forEach((element) => {
      points.push(
        new kakao.maps.LatLng(element._lat, element._lng)
      );
    });

    // 기존 폴리라인이 있으면 지도에서 제거
    if (polyline_ !== null) {
      polyline_.setMap(null);
    }

    // 지도에 표시할 선을 생성합니다
    polyline_ = new kakao.maps.Polyline({
      path: points, // 선을 구성하는 좌표배열 입니다
      strokeWeight: 10, // 선의 두께 입니다
      //   strokeColor: '#FFAE00', // 선의 색깔입니다
      strokeColor: '#3BB26F', // 선의 색깔입니다
      strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: 'solid', // 선의 스타일입니다
    });

    // 지도에 선을 표시합니다
    polyline_.setMap(map);
    // resultdrawArr.push(polyline_);
  }

  function initKakaoMap(locPosition) {
    var mapContainer = document.getElementById('map_div'), // 지도를 표시할 div
      mapOption = {
        // center: locPosition, // 지도의 중심좌표
        center: locPosition,
        level: 10, // 지도의 확대 레벨
      };

    if (!mapContainer.firstChild) {
      // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
      map = new kakao.maps.Map(mapContainer, mapOption);

      // 원을 생성합니다
      var circle = new kakao.maps.Circle({
        center: mapOption.center,
        radius: 10000,
        strokeWeight: 5, // 선의 두께입니다
        strokeColor: '#75B8FA', // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'dashed', // 선의 스타일 입니다
        fillOpacity: 0, // 채우기 불투명도 입니다
      });

      var centerAround = circle.getBounds();
      circle.setMap(map); // 원을 지도에 표시합니다
      console.log('원 생성' + centerAround);

      // centerAround의 남서쪽과 북동쪽 좌표를 가져옵니다
      var swLatLng = centerAround.getSouthWest();
      var neLatLng = centerAround.getNorthEast();

      var circleXY = {
        minX: swLatLng.getLng(), // 남서쪽 경도
        minY: swLatLng.getLat(), // 남서쪽 위도
        maxX: neLatLng.getLng(), // 북동쪽 경도
        maxY: neLatLng.getLat(), // 북동쪽 위도
      };

      fetchData(circleXY, mapOption.center, initMarkers);
	//   fetchData2();
      var prevLatlng; // 이전 중심 좌표를 저장할 변수

      routeNavigation(locPosition);

      // 도착
      marker_e = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(35.85354, 128.5102),
        iconSize: new kakao.maps.Size(24, 38),
        image: normalImage, // 마커 이미지
        map: map,
      });
      marker_e.normalImage = normalImage;
      marker_e.clickImage = clickImage;

      // 마커에 click 이벤트를 등록합니다
      kakao.maps.event.addListener(
        marker_e,
        'click',
        function () {
          // 클릭된 마커가 없거나, click 마커가 클릭된 마커가 아니면
          // 마커의 이미지를 클릭 이미지로 변경합니다

          if (
            !selectedMarker ||
            selectedMarker !== marker_e
          ) {
            // 클릭된 마커 객체가 null이 아니면
            // 클릭된 마커의 이미지를 기본 이미지로 변경하고
            !!selectedMarker &&
              selectedMarker.setImage(
                selectedMarker.normalImage
              );

            // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
            marker_e.setImage(marker_e.clickImage);

            // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
            selectedMarker = marker_e;
          } else if (selectedMarker === marker_e) {
            selectedMarker.setImage(
              selectedMarker.normalImage
            );
            selectedMarker = null;
          }
          showPopup('b');
        }
      );

      // 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
      kakao.maps.event.addListener(
        map,
        'dragend',
        function () {
          // 지도의  레벨을 얻어옵니다
          var level = map.getLevel();
          // 지도의 중심좌표를 얻어옵니다
          var latlng = map.getCenter();

          circle.setPosition(latlng); // 지도의 중심좌표를 원의 중심으로 설정합니다
          circle.setRadius(level * 100); // 원의 반지름을 지도의 레벨 * 1000으로 설정합니다
          circle.setMap(map); // 원을 지도에 표시합니다

          // 이전 중심 좌표가 있고, 새로운 중심 좌표와의 차이가 0.1 미만이면 AJAX 요청을 보내지 않습니다
          if (
            prevLatlng &&
            Math.abs(
              prevLatlng.getLat() - latlng.getLat()
            ) < 0.01 &&
            Math.abs(
              prevLatlng.getLng() - latlng.getLng()
            ) < 0.01
          ) {
            return;
          }
          // 새로운 중심 좌표를 이전 중심 좌표로 저장합니다
          prevLatlng = latlng;

          var centerAround = circle.getBounds();
          console.log(centerAround);

          swLatLng = centerAround.getSouthWest();
          neLatLng = centerAround.getNorthEast();

          circleXY = {
            minX: swLatLng.getLng(),
            minY: swLatLng.getLat(),
            maxX: neLatLng.getLng(),
            maxY: neLatLng.getLat(),
          };

          console.log(circleXY);

          for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
          }

          // markers 배열 초기화
          markers = [];

          var BodyJson = JSON.stringify(circleXY);
          fetchData(circleXY, latlng, initMarkers);
        }
      );
    }
  }

  function routeNavigation(locPosition) {
    // 2. 시작, 도착 심볼찍기

    // marker_s = new kakao.maps.Marker(
    // 	{
    // 	  position : locPosition,
    // 	  // icon : "/upload/tmap/marker/pin_r_m_s.png",
    // 	  iconSize : new kakao.maps.Size(24, 38),
    // 	  map : map
    // 	});
    console.log(
      '현재 위치 ' +
        locPosition.getLat() +
        ' ' +
        locPosition.getLng()
    );

    var headers = {};
    headers['appKey'] =
      'xJwFWDNBH24cPMQWAZVGA4AOusEnnPG620CxWT4z';

    fetch(
      'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result',
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          startX: locPosition.getLng().toString(),
          startY: locPosition.getLat().toString(), //
          // "startX": "127.02448847037635",
          // "startY": "37.65223738314796", //
          endX: '128.5102',
          endY: '35.85354',
          reqCoordType: 'WGS84GEO',
          resCoordType: 'EPSG3857',
          startName: '출발지',
          endName: '도착지',
        }),
      }
    )
      .then((response) => response.json()) // 응답을 JSON으로 변환
      .then((response) => {
        var resultData = response.features;

        //결과 출력
        var tDistance =
          '가장 가까운 화장실까지의 거리 : ' +
          (
            resultData[0].properties.totalDistance / 1000
          ).toFixed(1) +
          'km,';

        var tTime =
          ' 소요 시간 : ' +
          (resultData[0].properties.totalTime / 60).toFixed(
            0
          ) +
          '분';

        console.log(tDistance + tTime);
        message.info(tDistance + tTime, 10);

        //기존 그려진 라인 & 마커가 있다면 초기화
        if (resultdrawArr.length > 0) {
          for (var i in resultdrawArr) {
            resultdrawArr[i].setMap(null);
          }
          resultdrawArr = [];
        }

        drawInfoArr = [];

        for (var i in resultData) {
          //for문 [S]
          var geometry = resultData[i].geometry;
          var properties = resultData[i].properties;
          var polyline_;

          if (geometry.type == 'LineString') {
            for (var j in geometry.coordinates) {
              // 경로들의 결과값(구간)들을 포인트 객체로 변환
              var latlng = new Tmapv2.Point(
                geometry.coordinates[j][0],
                geometry.coordinates[j][1]
              );
              // 포인트 객체를 받아 좌표값으로 변환
              var convertPoint =
                new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                  latlng
                );
              // 포인트객체의 정보로 좌표값 변환 객체로 저장
              var convertChange = new Tmapv2.LatLng(
                convertPoint._lat,
                convertPoint._lng
              );
              // 배열에 담기
              drawInfoArr.push(convertChange);
            }
          } else {
            var markerImg = '';
            var pType = '';
            var size;

            if (properties.pointType == 'S') {
              //출발지 마커
              // markerImg = "/upload/tmap/marker/pin_r_m_s.png";
              pType = 'S';
              size = new kakao.maps.Size(24, 38);
            } else if (properties.pointType == 'E') {
              //도착지 마커
              // markerImg = "/upload/tmap/marker/pin_r_m_e.png";
              pType = 'E';
              size = new kakao.maps.Size(24, 38);
            } else {
              //각 포인트 마커
              // markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
              pType = 'P';
              size = new kakao.maps.Size(8, 8);
            }

            // 경로들의 결과값들을 포인트 객체로 변환
            var latlon = new Tmapv2.Point(
              geometry.coordinates[0],
              geometry.coordinates[1]
            );

            // 포인트 객체를 받아 좌표값으로 다시 변환
            var convertPoint =
              new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                latlon
              );

            var routeInfoObj = {
              markerImage: markerImg,
              lng: convertPoint._lng,
              lat: convertPoint._lat,
              pointType: pType,
            };
          }
        } //for문 [E]
        drawLine(drawInfoArr);
      })
      .catch((error) => {
        console.error('Error:', error);
        // 에러 처리 로직은 여기에 작성합니다.
      });
  }

  function asd() {
    // 위치 정보를 가져오는 함수
    const getLocation = new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            var lat = position.coords.latitude,
              lon = position.coords.longitude;
            var locPosition = new kakao.maps.LatLng(
              lat,
              lon
            );
            resolve(locPosition);
            console.log('현재위치를 가져옵니다.');
          },
          function () {
            var locPosition = new kakao.maps.LatLng(
              35.8678658,
              128.5967954
            );
            resolve(locPosition);
            console.log('현재위치를 가져올 수 없습니다.');
          }
        );
      } else {
        var locPosition = new kakao.maps.LatLng(
          35.8678658,
          128.5967954
        );
        resolve(locPosition);
        console.log('현재위치를 가져올 수 없습니다.');
      }
    });
    // 위치 정보를 가져온 후에 지도를 초기화하는 함수
    getLocation.then((locPosition) => {
      initKakaoMap(locPosition);
      console.log(
        '가져온 위치 정보로 지도를 초기화합니다.'
      );
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
          iconSize: new kakao.maps.Size(24, 38),
        });

        console.log(
          '사용자의 위치를 지속적으로 추적합니다.'
        );
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
        id="map_div">
	  </div>
	        {/* 팝업 정보가 있을 때만 Card 컴포넌트 렌더링 */}

      {popupInfo && (
        <div
          className="map-store-data"
          style={{ zIndex: 100 }}
        >
          <Card
            className="antCard"
            title={
              <div
                style={{
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span style={{ fontSize: '16px ' }}>
                  이마트 화장실
                </span>
                <Rate
                  style={{ float: 'right' }}
                  disabled
                  allowHalf
                  defaultValue={5}
                />
              </div>
            }
            extra={array.map((review, reviewIndex) => (
              <>
                {review.tag.map((item, index) => (
                  <Tag
                    key={index}
                    style={{
                      marginLeft: '0.2rem',
                      fontSize: '10px',
                      marginRight: '0.1rem',
                    }}
                    bordered={false}
                    color="cyan"
                  >
                    {item}
                  </Tag>
                ))}
              </>
            ))}

      		// extra={<a href="#" style={{fontSize:"18px"}} onClick={(e) => { e.preventDefault(); navigate('/review') }}>전체 리뷰</a>}
			>	
	{
	array.length > 0 ?(
	array.map((review, reviewIndex) => (
		<>
		<Card.Meta
		key={reviewIndex}
		description={
			<div>
			<span style={{ color: "black"}}>
				<span style={{fontSize: "15px"}}>{review.title}</span>
				<Rate style={{ float: "right", marginTop: "0.35rem" }} disabled allowHalf defaultValue={review.rate} />
			</span>
			<div style={{ marginTop: "0.7rem" , marginBottom : "3rem"}}>
				{review.tag.map((item, index) => (
				<Tag key={index} style={{ float: "left", marginRight: "1rem", fontSize:"10px" }} bordered={false} color="cyan">
					{item}
				</Tag>
				))}
				<span style={{ fontSize: "14px", float: "right" }}>{review.date}</span>
			</div>
			</div>
		}
		/>
			<Divider style={{ marginTop: 7, marginBottom: 15}} />
		</>
	))

	):(
		<>
		<Empty 
		description={
			<span style={{fontSize: "15px", color: "black"}}>
			리뷰가 존재하지 않습니다.
			</span>
		}
		/>
		<Divider style={{ marginTop: 7, marginBottom: 15}} />
		</>
	)
	}
  	<a href="#" style={{fontSize:"15px", float:"left", color:"#3BB26F"}}
     onClick={(e) => { 
      e.preventDefault(); 
      navigate('/review', 
      {state: {
        isToilet : true,
        toiletId : 1,
        garbageBinId : 1,
     }});  }}>전체 리뷰</a>	
	<Button type="primary" defaultColor="cyan" style={{float: "right" , backgroundColor : "#3BB26F"}}>길찾기</Button>
    </Card>
        </div>
      )}

	<FloatButton.Group
      shape="circle"
	  style={{
		right:"15",
	  }}
    >
      <FloatButton type="primary" icon={<PlayCircleOutlined />} />
      <FloatButton icon= {<CloseOutlined />} />

    </FloatButton.Group>
    </>
  );
}

export default MapPage;
