import React, { useState, useEffect } from 'react';
import { Columns, Column } from './Columns';
import { Rows, Row, FilterRows } from './Rows';
import { Footer, FooterCell } from './Footer';
import Utils from '../../Utils/Utils';
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
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    calcFormulaRows();
    if (table.groups) {
      const result = new Groups(table);
      setDataTable(result);
    }    
    setDataReady(true);
  }, [table]);

  useEffect(() => {
    if (dataReady)
      handleOrderBy(dataTable.columns.find(c => c?.sort), false);
  }, [dataReady]);

  const calcFormulaRows = () => {
    dataTable.columns.filter(col => col.formula).forEach(column => {
      dataTable.rows = dataTable.rows.map(row => {
        let newRow = {}
        newRow[column.name] = Utils.formula(row, column.formula);
        return {
          ...row, ...newRow
        }
      });
    });
  }

  const handleSearchBar = (value) => {
    setFilter({ ...filter, ...{ searchStr: value } })
  }

  const handleOrderBy = (column, revers = true) => {
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
    setFilter({ ...filter, ...{ orderBy: [column, sort] } });
  }

  return (
    <div className="react-table">
      <SearchBar onChange={(value) => handleSearchBar(value)}></SearchBar>

      {groups?.length ?
        <GroupsComponent>
          <div style={{ marginLeft: marginGroup }}>
            <Columns>
              {columns.filter(c => c?.isGroup !== false && c?.visible !== false).map((column, i) =>
                <Column key={i} onClickEvn={handleOrderBy} column={column}>{column.name}</Column>
              )}
            </Columns>
          </div>

          {groups.map((group, i) =>
            <React.Fragment key={i}>
              <Group group={group}>
                {group.key}: {group.name}
              </Group>
              {!group.root ?
                <>
                  <div className="react-table__group-content" style={{ marginLeft: marginGroup }}>
                    <Rows>
                      <FilterRows
                        rows={rows.filter(r => r.path === group.path)}
                        filter={filter}
                        result={(rows) =>
                          rows.map((row, i) =>
                            <Row columns={columns} row={row} key={i} index={i} />
                          )
                        }>
                      </FilterRows>
                    </Rows>
                    <Footer columns={columns}>
                      {columns.map((column, i) =>
                        column?.isGroup !== false && column?.visible !== false ?
                          <FilterRows
                            rows={rows.filter(r => r.path === group.path)}
                            filter={filter}
                            key={i}
                            result={(rows, i) =>
                              <FooterCell column={column} rows={rows} />
                            }>
                          </FilterRows> : ''
                      )}
                    </Footer>
                  </div>
                </>
                : ''}
            </React.Fragment>
          )}
        </GroupsComponent>
        :
        <>
          <Columns>
            {columns.filter(c => c?.visible !== false).map((column, i) =>
              <Column key={i} onClickEvn={handleOrderBy} column={column}>
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
