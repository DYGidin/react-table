import React, { useRef, useEffect, useContext } from 'react';
import { SET_GROUP_POSITION } from '../Constants/ActionTypes';
import { Context } from '../context';
function GroupListItem(props) {
  const { children, column, hoverElement } = props;
  const { dispatch, state, theme } = useContext(Context);
  const el = useRef();

  useEffect(() => {    
    dispatch({ type: SET_GROUP_POSITION, 
    payload: { name: column.name, position: el.current.getBoundingClientRect() } })
  }, [state.mouseDown])

  return (
    <div ref={el}
      style={theme.columns}
      className={'react-table__column ' + (hoverElement === column.name ? 'hover' : '')}>
      {children}
    </div>
  );
}

export default GroupListItem;
