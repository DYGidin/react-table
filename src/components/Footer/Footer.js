import React from 'react';

function Footer({children}) {
  return (
    <div className="react-table__footer">
      <div className="react-table__footer-container">
        {children}
      </div>
    </div>
  );
}

export default Footer;
