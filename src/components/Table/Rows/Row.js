import React, { useEffect, useState } from 'react';
import Utils from '../../../Utils/Utils';

function Row({ columns, row, paintRows = [] }) {

  const render = (column, val) => {
    if (!column.render)
      return val;
    return column.render(val)
  }

  const rowCells = columns.map((column, i) => {
    return column?.isGroup !== false && column?.visible !== false ?
      <div className="react-table__row-cell" key={i} >
        {column.formula ? render(column, Utils.formula(row, column.formula)) : render(column, row[column.name])}
      </div> : ''
  });

  const [style, setStyle] = useState(null);
  useEffect(() => {
    for (let index = 0; index < columns.length; index++) {
      const col = columns[index];
      const rows = paintRows.filter(r => r.name === col.name);
      for (let j = 0; j < rows.length; j++) {
        const pRow = rows[j];
        const { background, color } = pRow.condition(row[pRow.name]) ? pRow : '';
        if (background) {          
          setStyle({ background, color })
          break
        }
      }
    }   
  }, [row])

  return (
    <div className="react-table__row" style={style}>
      {rowCells}
    </div>
  );
}

export default Row;
