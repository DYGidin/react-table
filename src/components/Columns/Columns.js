import React from 'react';
function Columns({ children }) {
  return (
    <div className="react-table__columns">
      {children}
    </div>
  );
}

export default Columns;