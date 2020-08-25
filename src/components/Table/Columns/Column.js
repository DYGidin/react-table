import React from 'react';
function Column(props) {
  const { children, onClickEvn, column } = props;
  return (
    <div className="react-table__column" onClick={() => onClickEvn ? onClickEvn(column) : null}>
      <a className="react-table__column-link">{children}</a>
      {column?.sort ? <box-icon name={column.sort === 'asc' ? 'sort-up' : 'sort-down'}></box-icon> : ''}
    </div>
  );
}

export default Column;