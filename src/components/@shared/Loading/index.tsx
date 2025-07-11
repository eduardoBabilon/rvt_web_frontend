import React, { ComponentProps } from 'react';

import { CircularProgress } from '@mui/material';

type Props = {
  iconProps?: ComponentProps<typeof CircularProgress>;
};

export function Loading({ iconProps }: Props) {
  return (
    <div className="flex flex-col w-full flex-1 h-full items-center justify-center">
      <CircularProgress color="warning" {...iconProps} />
    </div>
  );
}
