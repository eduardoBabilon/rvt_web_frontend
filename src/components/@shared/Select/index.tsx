'use client';

import React, { ComponentProps, ReactNode } from 'react';

import { Input } from '../Input';
import { MenuItem } from '@mui/material';

export type SelectProps = Omit<ComponentProps<typeof Input>, 'select'> & {
  options: Array<{
    value: any;
    label: string;
    renderLabel?: (label: string) => ReactNode;
  }>;
};

export function Select({ options, ...rest }: SelectProps) {
  return (
    <Input
      select
      {...rest}
      inputProps={{
        style: {
          padding: 0,
        },
      }}
      withoutControl
      style={{
        padding: 0,
      }}
      SelectProps={{
        classes: {
          select: 'py-2 pl-3 pr-2',
        },
      }}
    >
      {options.map(({ label, value, renderLabel }) => {
        return (
          <MenuItem key={label + value} value={value}>
            {renderLabel ? renderLabel(value) : label}
          </MenuItem>
        );
      })}
    </Input>
  );
}
