import React, { useEffect, useState } from 'react';
import '../styles/header-style.css';
import '../styles/font-style.css';
import { Rate, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

function Header({ name = '　', rate, tag = [] }) {
  const navigate = useNavigate();

  // Ensure rate is always treated as a number and handle cases where it might be undefined or non-numeric
  const safeRate = Number(rate) || 0; // Default to 0 if rate is undefined or not a number
  const starRatingInitial = parseFloat(safeRate.toFixed(1));
  const [starRating, setStarRating] = useState(
    starRatingInitial
  );

  useEffect(() => {
    // Update starRating if rate changes
    const updatedRate = parseFloat(safeRate.toFixed(1));
    setStarRating(updatedRate);
  }, [safeRate]);

  return (
    <div
      className="header"
      style={{ fontFamily: 'SUITE-Regular' }}
    >
      <p className="header_text">{name}</p>
      <div className="header_rate">
        <Rate disabled allowHalf value={starRating} />
        <span
          style={{
            marginLeft: '0.7rem',
            marginRight: '9rem',
          }}
        >
          {safeRate.toFixed(2)}
        </span>
        {tag.map((item, index) => (
          <span className="header-tag" key={index}>
            <Tag bordered={false} size="large" color="cyan">
              {item}
            </Tag>
          </span>
        ))}
        <div>
          <button
            className="header-btn"
            onClick={() => navigate('/')}
          >
            <FontAwesomeIcon icon={faRightToBracket} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
