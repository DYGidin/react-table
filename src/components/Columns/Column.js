import React, { useRef, useEffect, useContext } from 'react';
import { Context } from '../context';
function Column(props) {
  const { children, onClickEvn, column } = props;
  const { handeMouseDown, handleMouseUp, handleOrderBy, dispatch, state } = useContext(Context);
  const el = useRef();

  useEffect(() => {    
    dispatch({ type: 'set-column', payload: { column, key: 'el', value: el.current } })
  }, [state.mouseDown])

  return (
    <div ref={el}
      className={'react-table__column ' + (column?.className || '')}
      onMouseDown={(event) => handeMouseDown({ column, el, event })}
      onMouseUp={() => handleMouseUp(column)}
      onClick={() => handleOrderBy(column)}>
      <a className="react-table__column-link">{children}</a>
      {column?.sort ? <i className={column.sort === 'asc' ? 'bx bx-sort-up' : 'bx bx-sort-down'}></i> : ''}
    </div>
  );
}

export default React.memo(Column, (prevProps, nextProps) => {
  return prevProps.column && prevProps.column === nextProps.column ? true : false
});
