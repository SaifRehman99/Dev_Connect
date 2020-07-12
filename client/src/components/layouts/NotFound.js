import React, { Fragment } from 'react';
const NotFound = () => {
  return (
    <Fragment>
      <div className='ag-page-404'>
        <div className='ag-toaster-wrap'>
          <h1 className='x-large text-primary'>
            <i className='fas fa-exclamation-triangle' /> 404 Not Found
          </h1>
          <div className='ag-toaster'>
            <div className='ag-toaster_back'></div>

            <div className='ag-toaster_front'>
              <div className='js-toaster_lever ag-toaster_lever'></div>
            </div>
            <div className='ag-toaster_toast-handler'>
              <div className='ag-toaster_shadow'></div>
              <div className='js-toaster_toast ag-toaster_toast js-ag-hide'></div>
            </div>
          </div>

          <canvas id='canvas-404' className='ag-canvas-404'></canvas>
          <img
            className='ag-canvas-404_img'
            src='https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/404-error-smoke-from-toaster/images/smoke.png'
            alt='image'
          />
        </div>
      </div>
    </Fragment>
  );
};

export default NotFound;
