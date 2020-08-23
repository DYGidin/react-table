import React, { useState, useEffect } from 'react';
import { Columns, Column } from './Columns';
import { Rows, Row } from './Rows';
import Groups from '../../Utils/Groups';
import Footer from './Footer/Footer';
import GroupsComponent from './Groups';
import './css/style.css';
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
      <Columns columns={columns}>
        {columns.map((column, i) =>
          column?.visible !== false ?
            <Column key={i}>{column.name}</Column> : ''
        )}
      </Columns>
      {groups?.length ?
        <GroupsComponent dataTable={dataTable} /> :
        <div>
          <Rows>
            {rows.map((row, i) =>
              <Row columns={columns} row={row} key={i} index={i} />
            )}
          </Rows>
          <Footer columns={columns} rows={rows} />
        </div>
      }
    </div >
  );
}

export default Table;
