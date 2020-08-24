import React from 'react';
import Utils from '../../../Utils/Utils';


function Row({ columns, row, index, onChange }) {
  const rowCells = columns.map((column, i) => {
    return column?.isGroup !== false && column?.visible!==false ?
      <div className="react-table__row-cell" key={i}>
        {column.formula ? Utils.formula(row, column.formula) : row[column.name]}
      </div> : ''
  });

  return (
    <div className="react-table__row">
      {rowCells}
    </div>
  );
}

export default Row;
