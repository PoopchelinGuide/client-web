import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import "../styles/map-style.css"

const {Tmapv2} = window;

function MapPage() {

  const navigate = useNavigate();

  function ininTMap() {

    const mapDiv = document.getElementById('map_div');

    // map_div가 이미 존재하면 초기화하지 않음
    if (!mapDiv.firstChild) {
      const map = new Tmapv2.Map("map_div", {
        center: new window.Tmapv2.LatLng(37.566481622437934,126.98502302169841),
        zoom: 15
      });
    }

}    
    useEffect(() => {
        ininTMap();
    }, []); // pageId가 변경될 때마다 이 효과가 실행되도록 합니다.


  return (
    <>
      <h1>Map Page</h1>
      <div id="map_div" style={{width: '100%', height: '400px'}}></div>

      <button onClick={() => navigate('/review')}>
        리뷰 페이지
      </button>
      <button onClick={() => navigate('/review-write')}>
        리뷰작성 페이지
      </button>
    </>
  );
}

export default MapPage;
