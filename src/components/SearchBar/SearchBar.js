import React, { useState } from 'react';

function SearchBar({ onChange, value }) {
  const [searchStr, setSearchStr] = useState(value || '');
  const handleOnChange = (e) => {    
    setSearchStr(e.target.value);
    if (onChange)
      onChange(e.target.value);
  }

  return (
    <div className="react-table__search-bar">
      <input type="text" value={searchStr} onChange={(e) => handleOnChange(e)} />
    </div>
  );
}

export default SearchBar;
