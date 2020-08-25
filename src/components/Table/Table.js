import React, { useState, useEffect } from 'react';
import { Columns, Column } from './Columns';
import { Rows, Row } from './Rows';
import { Footer, FooterCell } from './Footer';

import Groups from '../../Utils/Groups';
import GroupsComponent from './Groups/Groups';
import Group from './Groups/Group';

import './style.css';
function Table({ table }) {
  let [dataTable, setDataTable] = useState(table);  
  const { columns, groups, rows } = dataTable || [];
  const marginGroup = columns.filter(col => col.isGroup === false).length * 20;

  useEffect(() => {
    if (table.groups) {
      const result = new Groups(table);
      setDataTable(result);
    }
    sortRows(dataTable.columns.find(c => c?.sort), false);
  }, [table])

  const onChange = ({ index, name, value }) => {
    const row = table.rows.find(r => r.id === index);
    row[name] = value;
    const result = new Groups(table);
    setDataTable(result);
  }

  const sortRows = (column, revers = true) => {
    if (!column) return;

    const newColumns = columns.map(c => {
      let sort = '';
      if (c.name === column.name) {
        sort = revers === true ? c.sort === 'asc' ? 'desc' : 'asc' : column.sort;
      }
      return { ...c, sort: sort }
    });

    const sort = newColumns.find(c => c.name === column.name).sort;

    const newRows = [...rows].sort((a, b) => {
      return (sort === 'asc' ?
        a[column.name] > b[column.name]
        : a[column.name] < b[column.name]) ? 1 : -1
    });

    dataTable = { ...dataTable, ...{ rows: newRows }, ...{ columns: newColumns } }
    setDataTable(dataTable);
  }

  return (
    <div className="react-table">
      {groups?.length ?
        <GroupsComponent>
          <div style={{ marginLeft: marginGroup }}>
            <Columns>
              {columns.filter(c => c?.isGroup !== false && c?.visible !== false).map((column, i) =>
                <Column key={i}>{column.name}</Column>
              )}
            </Columns>
          </div>
          {groups.map((group, i) =>
            <div key={i}>
              <Group group={group}>
                {group.key}: {group.name}
              </Group>
              {!group.root ?
                <>
                  <div style={{ marginLeft: marginGroup }}>
                    <Rows>
                      {rows.filter(r => r.path === group.path).map((row, i) =>
                        <Row columns={columns} row={row} key={i} index={i} />
                      )}
                    </Rows>
                    <Footer columns={columns}>
                      {columns.map((column, i) =>
                        column?.isGroup !== false && column?.visible !== false ?
                          <FooterCell column={column} rows={rows.filter(r => r.path === group.path)} key={i}></FooterCell> : ''
                      )}
                    </Footer>
                  </div>
                </>
                : ''}
            </div>
          )}
        </GroupsComponent>
        :
        <>
          <Columns>
            {columns.filter(c => c?.isGroup !== false && c?.visible !== false).map((column, i) =>
              <Column key={i} onClickEvn={sortRows} column={column}>
                {column.name}
              </Column>
            )}
          </Columns>
          <Rows>
            {rows.map((row, i) =>
              <Row columns={columns} row={row} key={i} index={i} />
            )}
          </Rows>
          <Footer columns={columns}>
            {columns.filter(c => c?.visible !== false).map((column, i) =>
              <FooterCell column={column} rows={rows} key={i} />
            )}
          </Footer>
        </>
      }
    </div >
  );
}

export default Table;
