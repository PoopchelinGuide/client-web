import React from 'react';
import { useEffect } from 'react';
import '../styles/map-style.css';
import Navigatorbar from '../components/navigatorbar';

const { Tmapv2 } = window;

function MapPage() {
  function ininTMap() {
    const mapDiv = document.getElementById('map_div');

    // map_div가 이미 존재하면 초기화하지 않음
    if (!mapDiv.firstChild) {
      const map = new Tmapv2.Map('map_div', {
        center: new window.Tmapv2.LatLng(
          37.566481622437934,
          126.98502302169841
        ),
        zoom: 15,
      });
    }
  }
  useEffect(() => {
    ininTMap();
  }, []); // pageId가 변경될 때마다 이 효과가 실행되도록 합니다.

  return (
    <>
      <div
        id="map_div"
        style={{ width: '100%', height: '400px' }}
      ></div>
      {Navigatorbar()}
    </>
  );
}

export default MapPage;
