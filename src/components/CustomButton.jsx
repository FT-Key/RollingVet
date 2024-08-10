import React from 'react';
import Button from 'react-bootstrap/Button';

const CustomButton = ({ variant, buttonText, maxWidthCustom, onClick, className = '', btnClassName = '', center = true, paddingB = true, stlyes }) => {
  return (
    <div className={`${className}${center ? " d-flex justify-content-center align-items-center" : ''}${paddingB ? " pb-2" : ''}`}>
      <Button
        className={`${btnClassName}`}
        variant={variant}
        style={{ maxWidth: maxWidthCustom }}
        onClick={onClick}
        styles={stlyes}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default CustomButton;