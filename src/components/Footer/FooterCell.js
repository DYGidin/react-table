import React, { useContext } from 'react';
import { Context } from '../context';

function FooterCell({ column, rows }) {
  const { theme } = useContext(Context);
  
  const total = () => {
    const res = column.total(
      rows.map(r => {
        return r[column.name]
      }))
    return column.render ? column.render(res) : res;
  }
  const result = column.total ? total() : '';
  return (
    <div className="react-table__footer-cell" style={theme.footer}>
      {result}
    </div>
  );
}

export default FooterCell;
