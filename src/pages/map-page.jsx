import React from 'react';
import { useEffect, useState, useRef } from 'react';
import '../styles/map-style.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import imageSrc from '../markerImage/Toilet.png';
import imageSrc2 from '../markerImage/ToiletChoice.png';
import imageSrc3 from '../markerImage/garbege.png';
import imageSrc4 from '../markerImage/garbageChoice.png';
import '../styles/app-style.css';
import '../styles/font-style.css';

import {
  CloseOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import {
  Card,
  Rate,
  Tag,
  message,
  Button,
  Divider,
  FloatButton,
  Empty,
} from 'antd';

import { FaXmark } from 'react-icons/fa6';

const { Tmapv2 } = window;
const { kakao } = window;

function MapPage() {
  const navigate = useNavigate();

  var map = useRef(null);

  var marker_s, marker_e, marker_p1, marker_p2;

  var markers = []; // 마커를 담을 배열
  //   var markerList = [], // 마커 정보를 담은 배열
  var selectedMarker = null; // 클릭한 마커를 담을 변수 
  let prevInfo = null; // 이전에 열린 팝업 정보를 저장하는 변수

  const prevInfoId = useRef(null);
  const [nextId, setNextId] = useState(null); // 다음 팝업 정보를 저장하는 변수
  const setPrevInfoId = (id) => {
    prevInfoId.current = id;
  };

  var currentLocation = useRef(null); // 현재 위치를 저장할 변수

  var isGarbage = useRef(false); // 쓰레기통인지 화장실인지 구분하는 변수 boolean

  var nearDirect = useRef(false); // 가까운 화장실로 길찾기를 실행하기 위한 변수


  const polylineRef = useRef(null);
  //var polyline_ = null; // 현재 폴리라인을 저장할 변수
  // const polyline_ = useRef(null);

  let [popupInfo, setPopupInfo] = useState(null); // 현재 열려있는 팝업 정보를 저장하는 변수, boolean
  let [markerData, setMarkerData] = useState(null); // 서버로 받은 장소 중 클릭한 장소의 정보를 저장하는 변수

  // var [nearToilet, setNearToilet] = useState(); // 가까운 화장실 정보를 저장하는 변수
  var nearToilet = useRef(null);

  var circleCenter; // 원의 중심 좌표를 저장할 변수

  var imageSize = new kakao.maps.Size(70, 70); // 마커의 크기 기존 42, 56
  var choiceImageSize = new kakao.maps.Size(90, 90); // 선택한 마커의 크기 기존 44, 58

  var clickImage = createMarkerImage(
      imageSrc2,
      choiceImageSize
    ),
    normalImage = createMarkerImage(imageSrc, imageSize),
    garbegeImage = createMarkerImage(imageSrc3, imageSize),
    garbegeClickImage = createMarkerImage(
      imageSrc4,
      choiceImageSize
    );

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

  useEffect(() => {
    console.log('popupInfo가 변경될때마다 아래에 출력');
    console.log(popupInfo);
  }, [popupInfo]);

  // fetch 통신 method
  const fetchData = async (circleXY, latlng) => {
    try {
      const response = await fetch(
        // `http://poopchelin.kro.kr/toilet/range?x1=${circleXY.minX}&x2=${circleXY.maxX}&y1=${circleXY.minY}&y2=${circleXY.maxY}`,
        `https://poopchelin.kro.kr/toilet/range?x1=${
          circleXY.minX
        }&x2=${circleXY.maxX}&y1=${circleXY.minY}&y2=${
          circleXY.maxY
        }&x3=${latlng.getLng()}&y3=${latlng.getLat()}`,
        {
          method: 'GET',
        }
      );
      if (response.status === 200) {
        const markerList = await response.json();
        console.log('데이터 전송 완료');

        var garbageBin = markerList.garbageBin;
        var toilet = markerList.toilet;
        var nearestToilet = markerList.nearestToilet;

        console.log(garbageBin);
        console.log(toilet);
        console.log(nearestToilet);

        initMarkers(garbageBin, true);
        initMarkers(toilet, false);

        nearToilet.current = nearestToilet;
        console.log('가장 가까운 화장실' + nearToilet);
      } else if (response.status === 400) {
        message.error('위치정보가 존재하지 않습니다.', 2);
      }
    } catch (error) {
      message.error('잘못된 요청입니다.');
      console.error('오류 발생:', error);
    }
  };

  // fetch 통신 method
  const popupInfoRequest = async (id, type) => {
    try {
      const response = await fetch(
        `https://poopchelin.kro.kr/review/tg/popover/${id}?type=${type}`,
        {
          method: 'GET',
        }
      );
      if (response.status === 200) {
        const markerInfomation = await response.json();
        setNextId(id);

        // 현재 열린 팝업 정보가 null이 아니고, 새로운 팝업이 이전 팝업과 같다면 팝업을 닫고 함수를 종료합니다.
        if (
          prevInfo !== null &&
          prevInfoId.current === id
        ) {
          prevInfo = null;
          setPrevInfoId(null);
          setPopupInfo(prevInfo);

          console.log('팝업 끌 때 ID를 아래에 출력');
          console.log('id' + id);
          console.log(prevInfoId.current);

          return;
        }

        // 그렇지 않은 경우, 즉 현재 열린 팝업이 없거나 새로운 팝업이 이전 팝업과 다르다면
        // 현재 열린 팝업 정보를 새로운 팝업 정보로 업데이트합니다
        prevInfo = markerInfomation;
        setPrevInfoId(id);
        setPopupInfo(markerInfomation);

        // showPopup(markerInfomation, id);
      } else if (response.status === 400) {
        message.error('팝업창 오류', 2);
      }
    } catch (error) {
      message.error('잘못된 요청입니다.');
      console.error('오류 발생:', error);
    }
  };

  //Popup창 켜고 끄는 method
  function showPopup(info, id) {
    console.log('현재 팝업창 정보를 아래에 출력');
    console.log(info);

    // 현재 열린 팝업 정보가 null이 아니고, 새로운 팝업이 이전 팝업과 같다면 팝업을 닫고 함수를 종료합니다.
    if (prevInfo !== null && prevInfoId.current === id) {
      prevInfo = null;
      setPrevInfoId(null);
      setPopupInfo(prevInfo);

      console.log('팝업 끌 때 ID를 아래에 출력');
      console.log('id' + id);
      console.log(prevInfoId.current);

      return;
    }

    // 그렇지 않은 경우, 즉 현재 열린 팝업이 없거나 새로운 팝업이 이전 팝업과 다르다면
    // 현재 열린 팝업 정보를 새로운 팝업 정보로 업데이트합니다
    prevInfo = info;
    setPrevInfoId(id);
    setPopupInfo(info);

    console.log('팝업 킬 때 ID를 아래에 출력');
    console.log('id' + id);
    console.log(prevInfoId.current);
  }

  function initMarkers(markerList, isGarbage_) {
    var markerImage;

    if (!isGarbage_) {
      markerImage = normalImage;
    } else {
      markerImage = garbegeImage;
    }

    if (markerList === null) {
      console.log('데이터가 없습니다.');
      return;
    }
    markerList.forEach(function (markerInfo) {
      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(
          markerInfo.coordinateY,
          markerInfo.coordinateX
        ),
        map: map.current,
        image: markerImage, // 마커 이미지
      });

      if (!isGarbage_) {
        marker.normalImage = normalImage;
        marker.clickImage = clickImage;
      } else {
        marker.normalImage = garbegeImage;
        marker.clickImage = garbegeClickImage;
      }
      markers.push(marker);

      // 마커에 click 이벤트를 등록합니다
      kakao.maps.event.addListener(
        marker,
        'click',
        function () {
          // 클릭된 마커가 없거나, click 마커가 클릭된 마커가 아니면
          // 마커의 이미지를 클릭 이미지로 변경합니다

          if (markerInfo.type) {
            isGarbage.current = true;
          }
          else{
            isGarbage.current = false;
          }
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
          setMarkerData(markerInfo);
          popupInfoRequest(
            markerInfo.id,
            isGarbage.current.toString()
          );

          // showPopup(markerInfo);
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
    if (polylineRef.current !== null) {
      polylineRef.current.setMap(null);
    }

    // 지도에 표시할 선을 생성합니다
    polylineRef.current = new kakao.maps.Polyline({
      path: points,
      strokeWeight: 10,
      strokeColor: '#3BB26F',
      strokeOpacity: 0.7,
      strokeStyle: 'solid',
    });
    polylineRef.current.setMap(map.current);

    // 해당 키를 사용하여 로딩 메시지만 종료합니다.
    message.destroy('routeNavigationLoading');
  }

  async function initKakaoMap(locPosition) {
    var mapContainer = document.getElementById('map_div'), // 지도를 표시할 div
      mapOption = {
        // center: locPosition, // 지도의 중심좌표
        center: locPosition,
        level: 4, // 지도의 확대 레벨
      };

    if (!mapContainer.firstChild) {
      // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
      map.current = new kakao.maps.Map(
        mapContainer,
        mapOption
      );

      map.current.setMaxLevel(6);

      // 원을 생성합니다
      var circle = new kakao.maps.Circle({
        center: mapOption.center,
        radius: mapOption.level * 500, // 미터 단위의 원의 반지름입니다
        strokeWeight: 5, // 선의 두께입니다
        strokeColor: '#75B8FA', // 선의 색깔입니다
        strokeOpacity: 0, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'dashed', // 선의 스타일 입니다
        fillOpacity: 0, // 채우기 불투명도 입니다
      });

      circleCenter = circle.center;

      var centerAround = circle.getBounds();
      circle.setMap(map.current); // 원을 지도에 표시합니다
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

      console.log('fetch보내기전');
      await fetchData(circleXY, mapOption.center);
      console.log('fetch보낸 후');
      var prevLatlng; // 이전 중심 좌표를 저장할 변수

      routeNavigation(locPosition);
      console.log(map.current);

      // // 도착
      // marker_e = new kakao.maps.Marker({
      //   position: new kakao.maps.LatLng(35.85354, 128.5102),
      //   iconSize: new kakao.maps.Size(24, 38),
      //   image: normalImage, // 마커 이미지
      //   map: map,
      // });
      // marker_e.normalImage = normalImage;
      // marker_e.clickImage = clickImage;

      // // 마커에 click 이벤트를 등록합니다
      // kakao.maps.event.addListener(
      //   marker_e,
      //   'click',
      //   function () {
      //     // 클릭된 마커가 없거나, click 마커가 클릭된 마커가 아니면
      //     // 마커의 이미지를 클릭 이미지로 변경합니다

      //     if (
      //       !selectedMarker ||
      //       selectedMarker !== marker_e
      //     ) {
      //       // 클릭된 마커 객체가 null이 아니면
      //       // 클릭된 마커의 이미지를 기본 이미지로 변경하고
      //       !!selectedMarker &&
      //         selectedMarker.setImage(
      //           selectedMarker.normalImage
      //         );

      //       // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
      //       marker_e.setImage(marker_e.clickImage);

      //       // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
      //       selectedMarker = marker_e;
      //     } else if (selectedMarker === marker_e) {
      //       selectedMarker.setImage(
      //         selectedMarker.normalImage
      //       );
      //       selectedMarker = null;
      //     }
      //     showPopup('b');
      //   }
      // );

      // 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
      kakao.maps.event.addListener(
        map.current,
        'idle',
        async function () {
          // 지도의  레벨을 얻어옵니다
          var level = map.current.getLevel();
          // 지도의 중심좌표를 얻어옵니다
          var latlng = map.current.getCenter();

          circleCenter = latlng;

          circle.setPosition(latlng); // 지도의 중심좌표를 원의 중심으로 설정합니다
          circle.setRadius(level * 250); // 원의 반지름을 지도의 레벨 * 1000으로 설정합니다
          circle.setMap(map.current); // 원을 지도에 표시합니다

          // nearDirect가 true 일 때는 fetch 요청을 보낸 후 길찾기를 실행합니다
          // 이전 중심 좌표가 있고, 새로운 중심 좌표와의 차이가 0.05 미만이면 fetch 요청을 보내지 않습니다
          if(nearDirect.current){}
          else if (
            prevLatlng &&
            Math.abs(
              prevLatlng.getLat() - latlng.getLat()
            ) < 0.005 &&
            Math.abs(
              prevLatlng.getLng() - latlng.getLng()
            ) < 0.005
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

          console.log(circleXY, latlng);

          for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
          }

          // markers 배열 초기화
          markers = [];

          
          var BodyJson = JSON.stringify(circleXY);
          await fetchData(circleXY, latlng);

          if(nearDirect.current){
            routeNavigation(currentLocation.current);
            nearDirect.current = false;
          }
        }
      );
    }
  }

  function routeNavigation(locPosition, isDirections) {

    message.loading({
      content: '길찾기 중..',
      duration: 0, // 0으로 설정하여 수동으로 메시지를 종료할 수 있습니다.
      key: 'routeNavigationLoading'  // 이 key를 사용하여 특정 메시지를 제어합니다.
    });

    // 2. 시작, 도착 심볼찍기
    var endX = 126.9769,
      endY = 37.5726;
    if(isDirections){  
      endX = markerData.coordinateX;
      endY = markerData.coordinateY;
    }else if (nearToilet.current !== null) {
      console.log('가장 가까운 화장실로 길찾기 실행!!!!!!!!!!!!!!!!!');
      endX = nearToilet.current.coordinateX;
      endY = nearToilet.current.coordinateY;
    }

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
          startY: locPosition.getLat().toString(), //center
          endX: endX,
          endY: endY,
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

        let isGarbageString; 
        if(isGarbage.current){
          isGarbageString = '쓰레기통';
        }
        else{
          isGarbageString = '화장실';
        }

        //결과 출력
        var tDistance =
          `가장 가까운 ${isGarbageString}까지의 거리 : ` +
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
        message.info(tDistance + tTime, 3);

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
        return false;
        console.error('Error:', error);
        // 에러 처리 로직은 여기에 작성합니다.
      });
  }

  useEffect(() => {
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
              37.57636,
              126.9768
            );
            resolve(locPosition);
            message.error("현재위치를 가져올 수 없습니다. 위치정보를 허용해주세요.");
            console.log('현재위치를 가져올 수 없습니다');
          }
        );
      } else {
        var locPosition = new kakao.maps.LatLng(
          37.57636,
          126.9768
        );
        resolve(locPosition);
        message.error("현재위치를 가져올 수 없습니다.");
        console.log('현재위치를 가져올 수 없습니다.22 ');
      }
    });
    // 위치 정보를 가져온 후에 지도를 초기화하는 함수
    getLocation.then((locPosition) => {
      // setCurrentLocation(locPosition);
      currentLocation.current = locPosition;
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
          map: map.current,
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
  }, []); // pageId가 변경될 때마다 이 효과가 실행되도록 합니다.

  const polyline_remove = () => {
    if (polylineRef.current != null) {
      polylineRef.current.setMap(null);
    }
  };

  // 현재 위치와 목표 위치가 같은지 확인하는 함수
  function isLocationEqual(loc1, loc2, tolerance = 0.0001) { 
    return (
      Math.abs(loc1.getLat() - loc2.getLat()) < tolerance &&
      Math.abs(loc1.getLng() - loc2.getLng()) < tolerance
    );
  }

  const reload_navigation = async () => {
    console.log('버튼 클릭 전 가까운 화장실');
    console.log(nearToilet.current);

    if (!map.current) {
      console.log('map 객체가 아직 준비되지 않았습니다.');
      return;
    }
    if (!currentLocation.current) {
      console.log('현재 위치 정보가 없습니다.');
      return;
    }
    nearDirect.current = true; // 길찾기 버튼을 눌렀을 때 길찾기를 실행하기 위한 변수

    const currentMapCenter = map.current.getCenter();
    const targetLocation = currentLocation.current;

  // 현재 지도 중심과 목표 위치가 같은지 확인
  if (isLocationEqual(currentMapCenter, targetLocation)) {
    console.log("현재 위치가 같으므로 panTo를 실행하지 않습니다.");
    // 위치가 같으면 바로 routeNavigation을 호출
    console.log('길찾기 위치는?');
    console.log(currentLocation.current);
    routeNavigation(currentLocation.current);
    nearDirect.current = false;
  } else {
    // 위치가 다르면 새 위치로 이동을 시도
    try {
      console.log("현재 위치와 목표 위치가 다르므로 panTo를 실행합니다.")
      console.log(currentMapCenter);
      console.log(targetLocation);
      await map.current.panTo(targetLocation);
      console.log('길찾기 위치는?');
      console.log(currentLocation.current);
    } catch (error) {
      console.error('reload_navigation 함수에서 오류 발생:', error);
    }
  }
  console.log('버튼 클릭 이후 가까운 화장실');
  console.log(nearToilet.current);


  prevInfo = null;
  setPrevInfoId(null);
  setPopupInfo(prevInfo);
  };

  return (
    <>
      <div id="map_div"></div>
      {/* 팝업 정보가 있을 때만 Card 컴포넌트 렌더링 */}

      {popupInfo && (
        <div
          className="map-store-data"
          style={{ zIndex: 100 }}
        >
          <Card
            // id='suite-regular-font'
            id='suite-regular-font'
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
                <span style={{ fontSize: '16px ' , FontFamily:'SUITE-Regular'}}>
                  {popupInfo.name}
                </span>
                <Rate
                  style={{ float: 'right' }}
                  disabled
                  allowHalf
                  defaultValue={popupInfo.rate}
                />
              </div>
            }
            extra={popupInfo.tag.map((item, index) => (
              <Tag
                id='suite-regular-font'
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

            // extra={<a href="#" style={{fontSize:"18px"}} onClick={(e) => { e.preventDefault(); navigate('/review') }}>전체 리뷰</a>}
          >
            {popupInfo.recentReview.length > 0 ? (
              popupInfo.recentReview.map(
                (review, reviewIndex) => (
                  <div key={reviewIndex}>
                    {' '}
                    {/* 이 div에 key 추가 */}
                    <Card.Meta
                      description={
                        <div>
                          <span style={{ color: 'black' }}>
                            <span 
                              style={{ fontSize: '15px'}}
                            >
                              {review.content}
                            </span>
                            <Rate
                              style={{
                                float: 'right',
                                marginTop: '0.35rem',
                              }}
                              disabled
                              allowHalf
                              defaultValue={review.rate}
                            />
                          </span>
                          <div
                            style={{
                              marginTop: '0.7rem',
                              marginBottom: '3rem',
                            }}
                          >
                            {review.tag.map(
                              (item, index) => (
                                <Tag
                                  id='suite-regular-font'
                                  key={index}
                                  style={{
                                    float: 'left',
                                    marginRight: '1rem',
                                    fontSize: '10px',
                                  }}
                                  bordered={false}
                                  color="cyan"
                                >
                                  {item}
                                </Tag>
                              )
                            )}
                            <span
                              style={{
                                fontSize: '14px',
                                float: 'right',
                              }}
                            >
                              {moment
                                .utc(review.writeDate)
                                .format('YYYY-MM-DD')}
                            </span>
                          </div>
                        </div>
                      }
                    />
                    <Divider
                      style={{
                        marginTop: 7,
                        marginBottom: 15,
                      }}
                    />
                  </div>
                )
              )
            ) : (
              <>
                <Empty
                  description={
                    <span
                      style={{
                        fontSize: '15px',
                        color: 'black',
                      }}
                    >
                      리뷰가 존재하지 않습니다.
                    </span>
                  }
                />
                <Divider
                  style={{ marginTop: 7, marginBottom: 15 }}
                />
              </>
            )}
            <a
              href="#"
              style={{
                fontSize: '15px',
                float: 'left',
                color: '#3BB26F',
              }}
              onClick={(e) => {
                e.preventDefault();
                console.log('상세보기 클릭');
                console.log(isGarbage);
                navigate('/review', {
                  state: {
                    id: nextId,
                    type: isGarbage.current.toString(),
                  },
                });
              }}
            >
              전체 리뷰
            </a>
            <Button
              id='suite-regular-font'
              type="primary"
              style={{
                float: 'right',
                backgroundColor: '#3BB26F',
              }}
              onClick={() => {
                routeNavigation(currentLocation.current, true);

                prevInfo = null;
                setPrevInfoId(null);
                setPopupInfo(prevInfo);
              }}
            >
              길찾기
            </Button>
          </Card>
        </div>
      )}

      <FloatButton.Group
        shape="circle"
        style={{
          top: '3rem',
        }}
      >
        <FloatButton
          type="primary"
          onClick={reload_navigation}
          icon={<PlayCircleOutlined />}
        />
        <FloatButton
          onClick={polyline_remove}
          icon={<CloseOutlined />}
        />
      </FloatButton.Group>
    </>
  );
}

export default MapPage;
