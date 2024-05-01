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

  // Function to shorten name if longer than 10 characters
  const displayName =
    name.length > 9 ? name.substring(0, 9) + '...' : name;

  return (
    <div
      className="header"
      style={{ fontFamily: 'SUITE-Regular' }}
    >
      <p className="header_text">{displayName}</p>
      <div className="header_rate">
        <div className="header_star">
          <Rate
            disabled
            allowHalf
            value={starRating}
            style={{ marginRight: '1rem' }}
          />
          {safeRate.toFixed(2)}
        </div>

        {tag.map((item, index) => (
          <span className="header-tag" key={index}>
            <Tag bordered={true} size="large" color="cyan">
              {item}
            </Tag>
          </span>
        ))}
        <div className="header-button-box">
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
