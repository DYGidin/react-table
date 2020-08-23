import React from 'react';
import Utils from '../../../Utils/Utils';

function FooterCell({ column, rows }) {
  const result = column.total ? column.total(
    rows.map(r =>
      column.formula ? Utils.formula(r, column.formula) : r[column.name]
    )
  ) : '';
  return (
    <div className="footer-cell">
      {result}
    </div>
  );
}

export default FooterCell;
