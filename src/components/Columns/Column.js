import React, { useRef, useEffect, useContext } from 'react';
import { Context } from '../context';
function Column(props) {
  const { children, column, hoverElement } = props;
  const { handleOrderBy, dispatch, state, theme } = useContext(Context);
  const el = useRef();
 
  useEffect(() => {   
    dispatch({ type: 'set-column-postion', payload: { name:column.name, position: el.current.getBoundingClientRect() } })    
  }, [state.mouseDown])

  return (
    <div ref={el}
      className={'react-table__column ' + (hoverElement===column.name ? 'hover' : '')}
      style={theme.columns}
      onClick={() => handleOrderBy(column)}>
      <a className="react-table__column-link">{children}</a>
      {column?.sort ? <i className={column.sort === 'asc' ? 'bx bx-sort-up' : 'bx bx-sort-down'}></i> : ''}
    </div>
  );
}

export default Column
