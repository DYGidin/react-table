import React, { useRef, useEffect, useContext } from 'react';
import { Context } from '../context';
function Column(props) {
  const { children, onClickEvn, column, mouseDown } = props;
  const { handeMouseDown } = useContext(Context);
  const el = useRef(null);

  return (
    <div ref={el}
      className="react-table__column"
      onMouseDown={(e) => handeMouseDown({ column, el, e })}
      onClick={() => onClickEvn ? onClickEvn(column) : null}>
      <a className="react-table__column-link">{children}</a>
      {column?.sort ? <i className={column.sort === 'asc' ? 'bx bx-sort-up' : 'bx bx-sort-down'}></i> : ''}
    </div>
  );
}

export default Column;