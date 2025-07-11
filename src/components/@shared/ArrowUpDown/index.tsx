import React from 'react';

import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { twMerge } from 'tailwind-merge';

type Props = {
  arrowState: 'up' | 'down' | 'none';
};

export function ArrowUpDown({ arrowState }: Props) {
  const isUp = arrowState === 'up';
  const isDown = arrowState === 'down';
  return (
    <span className="flex justify-center items-center ">
      <ArrowUpward
        style={{ fontSize: '12px' }}
        className={twMerge('relative left-[1px] transition duration-200', isUp ? 'opacity-100' : 'opacity-40')}
      />
      <ArrowDownward
      style={{ fontSize: '12px' }}
        className={twMerge('relative right-[1px] transition duration-200', isDown ? 'opacity-100' : 'opacity-40')}
      />
    </span>
  );
}
