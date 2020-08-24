import Groups from "../../../Utils/Groups";

import React from 'react';

function Group({group, children}) {
  return (
    <div className="react-table__group-name"
      style={{ marginLeft: parseInt(group.level || 0) * 20 }}>
      {children}
    </div>
  )
}

export default Group;