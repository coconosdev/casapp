import React from 'react';

const AquaButton = (props) => (
  <button
    className="aqua-button"
    onClick={props.onClick}
    disabled={props.disabled}
  >
    <span>{props.children}</span>
    <div className="wave"></div>
  </button>
);

export default AquaButton;
