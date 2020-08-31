import React from 'react';
import Utils from '../../../Utils/Utils';

function FooterCell({ column, rows }) {
  const result = column.total ? column.total(
    rows.map(r => {
      const result = column.formula ? Utils.formula(r, column.formula) : r[column.name];
      return result
    }
    )
  ) : '';
  return (
    <div className="react-table__footer-cell">
      {result ? column.format ? column.format(result) : result : ''}
    </div>
  );
}

export default FooterCell;
