import React, { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return <div className='container'>{children}</div>;
};

interface FormProps {
  children: ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};

interface FormTitleProps {
  children: ReactNode;
}

export const FormTitle: React.FC<FormTitleProps> = ({ children }) => {
  return <h2 className='form-title'>{children}</h2>;
};

interface InfoTextProps {
  children: ReactNode;
}

export const InfoText: React.FC<InfoTextProps> = ({ children }) => {
  return <span className='info-text'>{children}</span>;
};

export const InfoTextContainer: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <div className='info-text-container'>{children}</div>;
};

interface LinkProps {
  href: string;
  children: ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, children }) => {
  return (
    <a href={href} className='link'>
      {children}
    </a>
  );
};
