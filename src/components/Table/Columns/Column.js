import React from 'react';
function Column(props) {
  const { children, onClickEvn, column } = props;
  return (
    <div className="react-table__column" onClick={() => onClickEvn ? onClickEvn(column) : null}>
      <a className="react-table__column-link">{children}</a><box-icon name='sort-up'></box-icon>
    </div>
  );
}

export default Column;