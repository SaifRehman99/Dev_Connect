import React, { Fragment } from 'react';
import spinner from './833.gif';

export default () => {
  return (
    <Fragment>
      <img
        src={spinner}
        style={{
          width: '70px',
          margin: 'auto',
          display: 'block',
        }}
        alt='loading....'
      />
    </Fragment>
  );
};
