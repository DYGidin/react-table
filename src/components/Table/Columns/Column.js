import React from 'react';
function Column(props) {
  return (
    <div className="column">
      {props.column.name}
    </div>
  );
}

export default Column;