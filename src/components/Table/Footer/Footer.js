import React from 'react';
import Utils from '../../../Utils/Utils';
import FooterCell from './FooterCell';
function Footer({ columns, rows }) {
  return (
    <div className="footer">
      <div className="footer-container" style={{ marginLeft: columns.filter(col => col.visible === false).length * 20 }}>
        {columns.map((column, i) =>
          column?.visible !== false ?
            <FooterCell column={column} rows={rows} key={i}></FooterCell> : ''
        )}
      </div>
    </div>
  );
}

export default Footer;
