import React from 'react';
function Column(props) {
  const { children } = props;
  return (
    <div className="column">
      {children}
    </div>
  );
}

export default Column;