import React, { useState, useEffect } from 'react';
import { Columns, Column } from './Columns';
import { Rows, Row, FilterRows } from './Rows';
import { Footer, FooterCell } from './Footer';

import Groups from '../../Utils/Groups';
import GroupsComponent from './Groups/Groups';
import Group from './Groups/Group';
import SearchBar from './SearchBar/SearchBar';

import './style.css';
function Table({ table }) {
  const [dataTable, setDataTable] = useState(table);
  const [filter, setFilter] = useState(table.filter || null);
  const { columns, groups, rows } = dataTable || [];
  const marginGroup = columns.filter(col => col.isGroup === false).length * 20;

  useEffect(() => {
    if (table.groups) {
      const result = new Groups(table);
      setDataTable(result);
      console.log(result)
    }
    hanldeOrderBy(dataTable.columns.find(c => c?.sort), false);
  }, [table])

  const handleSearchBar = (value) => {
    setFilter({ ...filter, ...{ searchStr: value } })
  }

  const hanldeOrderBy = (column, revers = true) => {
    if (!column) return;

    const newColumns = columns.map(c => {
      let sort = '';
      if (c.name === column.name) {
        sort = revers === true ? (c.sort === 'asc' ? 'desc' : 'asc') : column.sort;
      }
      return { ...c, sort: sort }
    });

    const sort = newColumns.find(c => c.name === column.name).sort;
    setDataTable({ ...dataTable, ...{ columns: newColumns } });
    setFilter({ ...filter, ...{ orderBy: [column.name, sort] } });
  }

  return (
    <div className="react-table">
      <SearchBar onChange={(value) => handleSearchBar(value)}></SearchBar>
     
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
              <Column key={i} onClickEvn={hanldeOrderBy} column={column}>
                {column.name}
              </Column>
            )}
          </Columns>
          <Rows>
            <FilterRows
              rows={rows}
              filter={filter}
              result={(rows) =>
                rows.map((row, i) =>
                  <Row columns={columns} row={row} key={i} index={i} />)
              }>
            </FilterRows>
          </Rows>
          <Footer columns={columns}>
            {columns.filter(c => c?.visible !== false).map((column, i) =>
              <FilterRows
                rows={rows}
                filter={filter}
                key={i}
                result={(rows, i) =>
                  <FooterCell column={column} rows={rows} />
                }>
              </FilterRows>
            )}
          </Footer>
        </>
      }
    </div >
  );
}

export default Table;
