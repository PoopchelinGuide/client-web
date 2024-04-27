import React from 'react';

function Modal({ isOpen, close, children }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        style={{
          padding: '20px',
          background: 'white',
          borderRadius: '5px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          minWidth: '300px',
          zIndex: 1000,
        }}
      >
        {children}
        <button
          onClick={close}
          style={{ marginTop: '20px' }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default Modal;
