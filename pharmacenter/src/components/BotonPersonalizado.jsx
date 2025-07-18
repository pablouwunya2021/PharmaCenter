import React from 'react';

const BotonPersonalizado = ({ texto, url }) => {
  return (
    <><div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000
      }}></div><a
          href={url}
          style={{
              display: 'inline-block',
              padding: '12px 35px',
              backgroundColor: '#ffffff',
              color: '#5c3c92',
              border: '2px solid #5c3c92',
              borderRadius: '30px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              fontFamily: "'Montserrat', sans-serif"
          }}
          onMouseOver={(e) => {
              e.target.style.backgroundColor = '#5c3c92';
              e.target.style.color = 'white';
          } }
          onMouseOut={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.color = '#5c3c92';
          } }
      >
              {texto}
          </a></>
  );
};

export default BotonPersonalizado;