import React, { useState, useEffect } from 'react';
import Column from './Column/Column';
import Row from './Row/Row';
import Groups from './Utils/Groups';
import './css/style.css';
import Footer from './Footer/Footer';

function Table({ table }) {
  const [dataTable, setDataTable] = useState(JSON.parse(JSON.stringify(table)));
  const { columns, groups } = dataTable;
  const [rows, setRows] = useState(dataTable.rows);

  useEffect(() => {
    if (dataTable.groups) {
      const result = new Groups(table);
      setDataTable(result);
      setRows(result.rows);
      console.log(dataTable)
    }
  }, [table])


  const onChange = ({ index, name, value }) => {
    const newRows = [...rows];
    let newRow = newRows[index];
    newRow = value;
    newRows[index][name] = newRow;
    //setRows(newRows);
    table.rows = newRows;
    const result = new Groups(table);
    console.log(result)    
    //setRows(result.rows);
    setDataTable(result);
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
        <div key={i}>
          <div className="group-name" style={{ marginLeft: parseInt(group.level || 0) * 20 }}>
            {group.key}: {group.name}
          </div>
          {group.root === 'false' ?
            <>
              <div className="rows" style={{ marginLeft: columns.filter(col => col.visible === false).length * 20 }}>
                {
                  rows.map((row, i) =>
                    row.path === group.path ?
                      <Row columns={columns} row={row} key={i} index={i} onChange={(e) => { onChange(e) }} /> : ''
                  )
                }
              </div>
              <div className="footer">
                <div className="footer-container" style={{ marginLeft: columns.filter(col => col.visible === false).length * 20 }}>
                  {columns.map((column, i) =>
                    column.visible ?
                      <Footer column={column} rows={rows.filter(r => r.path === group.path)} key={i} /> : ''
                  )}
                </div>
              </div>
            </>
            : ''}
        </div>
      )
      }

    </div >
  );
}

export default Table;
