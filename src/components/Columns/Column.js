import React, { useRef, useEffect, useContext } from 'react';
import { Context } from '../context';
function Column(props) {
  const { children, onClickEvn, column } = props;
  const { handeMouseDown, dispatch, state } = useContext(Context);
  const el = useRef();
  console.log('col render')
  useEffect(() => {    
    dispatch({ type: 'set-column', payload: { column, key: 'el', value: el.current } })
  }, [state.mouseDown])

  const resetColumn = () => {
    dispatch({ type: 'mouse-down', payload: false })
  }

  return (
    <div ref={el}
      className={'react-table__column ' + (column?.className || '')}
      onMouseDown={(event) => handeMouseDown({ column, el, event })}
      onMouseUp={() => resetColumn()}
      onClick={() => onClickEvn ? onClickEvn(column) : null}>
      <a className="react-table__column-link">{children}</a>
      {column?.sort ? <i className={column.sort === 'asc' ? 'bx bx-sort-up' : 'bx bx-sort-down'}></i> : ''}
    </div>
  );
}

export default React.memo(Column, (prevProps, nextProps) => {
  return prevProps.column && prevProps.column === nextProps.column ? true : false
});