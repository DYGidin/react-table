import React, { useContext } from 'react';
import { Context } from '../context';
function GroupsComponent({ children }) {
  const { theme } = useContext(Context);
  
  return (
    <div className="react-table__groups-container" style={{ backgroundColor: theme.columns.background }}>
      {children}
    </div>
  );
}

export default GroupsComponent;
