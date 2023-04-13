import React from "react";

function Loading() {
  return (
    <div className='loading'>
      <svg className='loading-svg'>
        <use className='loading-use' xlinkHref='/src/assets/refresh.svg#test' />
      </svg>
    </div>
  );
}

export default Loading;
