import React from 'react';

function RowEdit({type, value, onChange}) {
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

  let oldValue = value;
  const onBlur = (e) => {
    if (oldValue !== e.target.value) {
      onChange(inputType(type)==='number' ? parseInt(e.target.value) : e.target.value);
      oldValue = e.target.value;
    }
  };

  return (
    <div className="row">
      <input type={inputType(type)} defaultValue={value} onBlur={onBlur} />
    </div>
  );
}

export default RowEdit;
