'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';

import { useButton } from './hooks/useButton';

import { twMerge } from 'tailwind-merge';
import { CircularProgress } from '@mui/material';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick?: (ev?: React.MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
  dataTestId?: string;
  className?: string;
  isDisabled?: boolean;
  isOutlined?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
};

export function Button({
  className = '',
  dataTestId,
  isDisabled,
  isOutlined,
  isLoading,
  children,
  onClick,
  type,
  ...rest
}: ButtonProps) {
  const { getAnimation } = useButton();

  const styleButton = isOutlined
    ? 'flex items-center justify-center gap-2 p-3 h-10 border  bg-transparent text-white border-borderColor-secondary rounded-md text-lg font-normal uppercase'
    : 'flex items-center justify-center gap-2 p-3  h-10 bg-brand-primary text-white rounded-md text-sm shadow-md uppercase';

  return (
    <button
      {...rest}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      data-testid={dataTestId}
      type={type}
      className={twMerge(styleButton + getAnimation(isDisabled), className)}
    >
      {isLoading ? (
        <>
          <span className="text-lg font-normal leading-6 text-inherit">{`Carregando`}</span>
          <CircularProgress color="warning" />
        </>
      ) : (
        children
      )}
    </button>
  );
}
