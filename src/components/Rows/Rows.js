import React from 'react';

function Rows(props) {
  const { children } = props;    
  return (
    <div className="react-table__rows">
      {children}
    </div>
  )
}
export default Rows;