import React, { useRef, useEffect } from 'react';

function RowEdit({ type, value, onChange }) {
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

  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.value = value
  }, [value]);
  
  let oldValue = value;
  const onBlur = (e) => {
    if (oldValue !== e.target.value) {
      onChange(inputType(type) === 'number' ? parseInt(e.target.value) : e.target.value);
      oldValue = e.target.value;
    }
  };

  return (
    <div className="react-table__row">
      <input type={inputType(type)} ref={inputEl} onBlur={onBlur} />
    </div>
  );
}

export default RowEdit;
