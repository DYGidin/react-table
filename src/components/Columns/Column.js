import React, { useRef, useEffect, useContext } from 'react';
import { Context } from '../context';
function Column(props) {
  const { children, onClickEvn, column } = props;
  const { handeMouseDown, dispatch } = useContext(Context);
  const el = useRef(null);
  useEffect(() => {     
    dispatch({ type: 'set-column', payload: { column, el: el.current } }) 
  }, [column])
  return (
    <div ref={el}
      className="react-table__column"
      onMouseDown={(event) => handeMouseDown({ column, el, event })}
      onClick={() => onClickEvn ? onClickEvn(column) : null}>
      <a className="react-table__column-link">{children}</a>
      {column?.sort ? <i className={column.sort === 'asc' ? 'bx bx-sort-up' : 'bx bx-sort-down'}></i> : ''}
    </div>
  );
}

export default Column;