import React from 'react';
function Columns(props) {
  const { columns, children } = props;  
  return (
    <div className="columns"
      style={{ marginLeft: columns.filter(col => col.visible === false).length * 20 }}>
      {children}
    </div>
  );
}

export default Columns;