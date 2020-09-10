import React from 'react';
import Calc from '../../utils/Calc';

function FooterCell({ column, rows }) {
  const total = () => {
    const res = column.total(
      rows.map(r => {
        const result = column.formula ? Calc.formula(r, column.formula) : r[column.name];
        return result
      }))
    return column.render ? column.render(res) : res;
  }
  const result = column.total ? total() : '';
  return (
    <div className="react-table__footer-cell">
      {result}
    </div>
  );
}

export default FooterCell;
