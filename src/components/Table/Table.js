import React, { useState } from 'react';
import Column from './Column/Column';
import Row from './Row/Row';
import './css/style.css';
import Footer from './Footer/Footer';

function Table({ dataTable }) {
  const [rows, setRows] = useState(dataTable.rows);
  let [columns, setColumns] = useState(dataTable.columns);
  let [groups, setGroup] = useState(dataTable.groups);
  console.log(rows)
  const onChange = ({ index, name, value }) => {
    const newRows = [...rows];
    let newRow = newRows[index];
    newRow = value;
    newRows[index][name] = newRow;
    setRows(newRows)
  }

  return (
    <div className="table">
      <div className="columns" style={{ marginLeft: columns.filter(col => col.visible === false).length * 20 }}>
        {columns.map((column, i) =>
          column.visible ?
            <Column column={column} key={i} /> : ''
        )}
      </div>
      {groups.map((group, i) =>
        <>
          <div className="group-name" key={i} style={{ marginLeft: parseInt(group.level) * 20 }}>
            {group.key}: {group.name}
          </div>
          {group.root === 'false' ?
            <div className="rows" style={{ marginLeft: columns.filter(col => col.visible === false).length * 20 }}>
              {
                rows.map((row, i) =>                
                  row.group === group.group ?
                    <Row columns={columns} row={row} key={i} index={i} onChange={(e) => { onChange(e) }} /> : ''
                )
              }
            </div> : ''}
          {/* <div className="footer">
            {columns.map((column, i) =>
              <Footer column={column} rows={filterByGroup(rows, group, 'category')} key={i} />
            )}
          </div> */}
        </>
      )
      }

    </div >
  );
}

export default Table;
