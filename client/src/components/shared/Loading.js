import React from 'react';

const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{'minHeight':'50vh'}}>
      <div className="spinner-border text-info" role="status"></div>
      <strong className='ml-2'>Loading...</strong>
    </div>
  )
}

export default Loading;
