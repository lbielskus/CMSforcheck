import React from 'react';
import { ButtonProps } from '../../types/propTypes';
import { Container } from '../../types/ButtonElements';

const Button = ({ title, type, disabled, onClick }: ButtonProps) => {
  return (
    <Container type={type} disabled={disabled} onClick={onClick}>
      {disabled ? 'Processing...' : title}
    </Container>
  );
};

export default Button;
