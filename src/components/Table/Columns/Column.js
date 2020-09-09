import React from 'react';
function Column(props) {
  const { children, onClickEvn, column } = props;
  return (
    <div className="react-table__column" onClick={() => onClickEvn ? onClickEvn(column) : null}>
      <a className="react-table__column-link">{children}</a>
      {column?.sort ? <i className={column.sort === 'asc' ? 'bx bx-sort-up' : 'bx bx-sort-down'}></i> : ''}
    </div>
  );
}

export default Column;