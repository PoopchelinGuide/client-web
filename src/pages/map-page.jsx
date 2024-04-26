import React from 'react';
import { useNavigate } from 'react-router-dom';

function MapPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Map Page</h1>
      <button onClick={() => navigate('/review')}>
        리뷰 페이지
      </button>
      <button onClick={() => navigate('/review-write')}>
        리뷰작성 페이지
      </button>
    </div>
  );
}

export default MapPage;
