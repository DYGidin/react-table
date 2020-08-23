import React from 'react';
import Footer from './Footer/Footer';
import Row from './Rows/Row';

function GroupsComponent({ dataTable }) {
  const { columns, groups, rows } = dataTable || [];
  return (
    <div className="groups-container">
      {groups.map((group, i) =>
        <div key={i}>
          <div className="group-name"
            style={{ marginLeft: parseInt(group.level || 0) * 20 }}>
            {group.key}: {group.name}
          </div>
          {group.root === 'false' ?
            <>
              <div className="rows"
                style={{ marginLeft: columns.filter(col => col.visible === false).length * 20 }}>
                {
                  rows.map((row, i) =>
                    row.path === group.path ?
                      <Row columns={columns} row={row} key={i} index={i} /> : ''
                  )
                }
              </div>              
              <Footer columns={columns} rows={rows.filter(r => r.path === group.path)} key={i} />
            </>
            : ''}
        </div>
      )}
    </div>
  );
}

export default GroupsComponent;
