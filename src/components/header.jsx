import React, { useEffect, useState } from 'react';
import '../styles/header-style.css';
import '../styles/font-style.css';
import { Rate, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

function Header(name, rate, tag) {
  var num = parseFloat(rate.toFixed(1)); // 소수 첫째 자리로 반올림하고 숫자로 변환
  const [starRating, setStarRating] = useState(num);

  const starChange = useEffect(() => {
    setStarRating(num);
  });

  const navigate = useNavigate();
  console.log('Received in Header: ', {
    name,
    rate,
    tag,
  });

  if (name === undefined) {
    name = '　';
  }
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
          {rate.toFixed(2)}
        </span>

        {tag.map((item, index) => (
          <span className="header-tag" key={index}>
            {' '}
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
