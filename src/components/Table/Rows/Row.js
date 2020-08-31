import React from 'react';
import Utils from '../../../Utils/Utils';


function Row({ columns, row, index, onChange }) {

  const render = (column, val) => {
    if (!column.render)
      return val;
    return column.render(val)
  }

  const rowCells = columns.map((column, i) => {
    return column?.isGroup !== false && column?.visible !== false ?
      <div className="react-table__row-cell" key={i}>        
        {column.formula ? render(column, Utils.formula(row, column.formula)) : render(column, row[column.name])}
      </div> : ''
  });

  return (
    <div className="react-table__row" style={{'background':'red'}}>
      {rowCells}
    </div>
  );
}

export default Row;
