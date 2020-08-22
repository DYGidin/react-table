import React, { useState } from 'react';


function SearchBar() {
  const [count, setCount] = useState(0);
  const handleClick = () => setCount(count + 1);
  console.log('Search Bar')
  return (
    <div className="search-bar">
      <p onClick={handleClick}>Вы кликнули {count} раз(а)</p>
    </div>
  );
}

export default SearchBar;
