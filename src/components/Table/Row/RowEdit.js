import React, { useState } from 'react';

function RowEdit({ type, value, onChange }) {
  const [inputValue, setValue] = useState(value);
  const inputType = (type) => {
    switch (type) {
      case Number:
        return 'number'
      case String:
        return 'text'
      default:
        break;
    }
  }

  const handleClick = (e) => {
    onChange(inputType(type) === 'number' ? parseInt(inputValue) : inputValue);
  };

  return (
    <div className="row">
      <span>{inputValue}</span>
      <input type={inputType(type)} value={inputValue} onChange={(e) => setValue(e.target.value)} />
      <button className="apply" onClick={handleClick}>
        apply
      </button>
    </div>
  );
}

export default RowEdit;
