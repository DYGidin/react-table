import React, { useRef, useEffect, useContext, useState } from 'react';
import { Context } from '../context';
function GroupListItem(props) {
  const { children, column, hoverElement } = props;
  const { dispatch, state } = useContext(Context);
  const el = useRef();

  useEffect(() => {    
    dispatch({ type: 'set-group-position', 
    payload: { name: column.name, position: el.current.getBoundingClientRect() } })
  }, [state.mouseDown])

  return (
    <div ref={el}
      className={'react-table__column ' + (hoverElement === column.name ? 'hover' : '')}>
      {children}
    </div>
  );
}

export default GroupListItem;
