import React from 'react';

function Rows(props) {
  const { children } = props;  
  
  return (
    <div className="rows">
      {children}
    </div>
  )
}
export default Rows;