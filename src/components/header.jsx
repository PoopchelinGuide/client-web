import React from 'react';
import '../styles/header-style.css';
import '../styles/font-style.css';
import { Rate, Tag } from 'antd';

function Header(name, rate, tag) {
  return (
    <div
      className="header"
      style={{ fontFamily: 'SUITE-Regular' }}
    >
      <p className="header_text">{name} 화장실</p>
      <div className="header_rate">
        <Rate disabled allowHalf defaultValue={rate} />
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
      </div>
    </div>
  );
}
export default Header;
