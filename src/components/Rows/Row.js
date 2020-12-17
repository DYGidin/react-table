import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../context';
function Row({ columns, row, paintRows = [] }) {
  
  const { theme } = useContext(Context);
  const [styleRow, setStyleRow] = useState(null);
  const [styleCell, setStyleCell] = useState([]);
  //console.log('row render')
  const render = (column, val) => {
    if (!column.render)
      return val;
    return column.render(val)
  }

  const rowCells = columns.map((column, i) => {
    let style = {};
    styleCell.forEach(st => {
      if (st.name === column.name && row[column.name] === st.value)
        style = st.style
    })
    
    return !column?.isGroup  && column?.visible !== false ?
      <div className="react-table__row-cell" key={i} 
        style={style}>
        {render(column, row[column.name])}
      </div> : ''
  });


  useEffect(() => {
    setStyleCell([])
    const arrCell = []
    paintRows.forEach(rowP => {
      if (rowP.condition(row) && rowP.type === 'row') {
        setStyleRow(rowP.style)
      }
      if (rowP.condition(row) && rowP.type === 'cell') {        
        arrCell.push({ name: rowP.name, value: row[rowP.name], style: rowP.style })        
        setStyleCell(arrCell)
      }
    })    
  }, [row])

  return (
    <div className="react-table__row" style={{...theme.rows, ...styleRow}}>
      {rowCells}
    </div>
  );
}

export default React.memo(Row);

