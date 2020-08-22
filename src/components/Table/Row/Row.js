import React from 'react';
import Utils from '../Utils/Utils';
import RowEdit from './RowEdit';

function Row({ columns, row, index, onChange }) {  
  const rowCells = columns.map((column, i) => {
    return column.editable && column?.visible === true ?
      <div className="row-cell" key={i}>
        <RowEdit type={column.type} value={row[column.name]} onChange={e => onChange({ index: index, name: column.name, value: e })}></RowEdit>
      </div> : column?.visible === true ?
        <div className="row-cell" key={i}>
          {column.formula ? Utils.formula(row, column.formula) : row[column.name]}
        </div> : ''
  });

  return (
    <div className="row">
      {rowCells}
    </div>
  );
}

export default Row;
