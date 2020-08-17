import React from 'react';
import jukelogo from './jukelogo.svg';
const Landing = ({ login }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <img src={jukelogo} alt="Juke Jams Logo"></img>
      <div>{login}</div>
    </div>
  );
};
export default Landing;