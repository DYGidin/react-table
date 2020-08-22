import React, { useState, useEffect } from 'react';
import Column from './Columns/Column';
import Row from './Row/Row';
import Groups from '../../Utils/Groups';
import './css/style.css';
import Footer from './Footer/Footer';
import GroupsComponent from './Groups';
function Table({ table }) {
  const [dataTable, setDataTable] = useState(table);
  const { columns, groups, rows } = dataTable || [];
  
  useEffect(() => {
    if (table.groups) {
      const result = new Groups(table);
      setDataTable(result);      
    }
  }, [table])

  const onChange = ({ index, name, value }) => {
    const row = table.rows.find(r => r.id === index);
    row[name] = value;
    const result = new Groups(table);
    setDataTable(result);
  }

  return (
    <div className="table">
      <div className="columns"
        style={{ marginLeft: columns.filter(col => col.visible === false).length * 20 }}>
        {columns.map((column, i) =>
          column?.visible !== false ?
            <Column column={column} key={i} /> : ''
        )}
      </div>
      {groups?.length ?
        <GroupsComponent dataTable={dataTable}></GroupsComponent> :
        <div>
          <div className="rows">
            {rows.map((row, i) =>
              <Row columns={columns} row={row} key={i} index={i} />
            )}
          </div>
          <div className="footer">
            <div className="footer-container">
              {columns.map((column, i) =>
                column?.visible !== false ?
                  <Footer column={column} rows={rows} key={i} /> : ''
              )}
            </div>
          </div>
        </div>
      }
    </div >
  );
}

export default Table;
