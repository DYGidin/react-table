import React, { useRef, useEffect, useContext, useState } from 'react';
import { Context } from '../context';
function MoveComponent({ children, handleMoveStart, handleMove, handleMoveStop }) {
  const [style, setStyle] = useState(null)
  const [mouseDown, setMouseDown] = useState(false);
  const offset = useRef();

  useEffect(() => {
    if (mouseDown) {
      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    }
  }, [mouseDown])

  const mouseMove = (e) => {
    e.preventDefault();
    const { offsetX, offsetY, width, height } = offset.current;
    const { scrollX, scrollY } = window;

    const position = {
      display: 'initial',
      position: 'fixed',
      width,
      height,
      left: (e.pageX - offsetX - scrollX),
      top: (e.pageY - offsetY - scrollY)
    }
    handleMove(position);
    setStyle(position);
  }

  const mouseUp = () => {
    setMouseDown(false)
    setStyle(null)
    handleMoveStop();
  }

  const handleMouseDown = (event) => {
    const { left, top, width, height } = event.target.getBoundingClientRect();

    offset.current = {
      offsetX: event.clientX - left,
      offsetY: event.clientY - top,
      width, height
    }

    setStyle({
      display: 'none',
      left,
      top,
      width,
      height,
      position: 'fixed',
      zIndex: 9999
    })
    setMouseDown(true);
    handleMoveStart(event)
  }

  return (
    <div
      style={{ width: '100%' }}
      onMouseDown={(event) => handleMouseDown(event)}>
      {style &&
        <div style={style}>{children}</div>
      }
      {children}
    </div>)
}

export default MoveComponent;