import React from 'react';

function Group({ group, children, openClose }) {  
  return (
    <div className="react-table__group-name group-name"
      style={{ marginLeft: parseInt(group.level || 0) * 20 }}>
      <span className="group-name__open-close">   
      <i className={group.open ? 'bx bxs-chevron-down' :'bx bxs-chevron-right'} onClick={() => openClose({ group: group, open: !group.open})}></i>         
      </span>&nbsp;{children}
    </div>
  )
}

export default Group;