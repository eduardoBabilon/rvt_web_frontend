'use client';
import React from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useSnackbarMessage } from './hooks/useSnackbarMessage';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { SnackbarProps } from '@/contexts/Snackbar/types';
import CrossIcon from '@/assets/icons/Cross';
import { Text5 } from '../Texts';
import { When } from '../When';

type Props = {
  snackbar: SnackbarProps;
  deleteSnackbar: () => void;
  customRef?: React.RefObject<HTMLDivElement>;
};

export const SnackbarMessage = ({ deleteSnackbar, snackbar, customRef }: Props) => {
  const { handleDeleteSnackbar, show } = useSnackbarMessage({ deleteSnackbar, snackbar });
  const { message, type } = snackbar;

  const colorSnackbar = {
    error: 'bg-alerts-red',
    success: 'bg-alerts-green',
    warn: 'bg-alerts-orange',
  };

  const iconSnackbar = {
    error: <ErrorOutlineIcon style={{ color: 'white' }} />,
    success: <CheckCircleOutlineIcon style={{ color: 'white' }} />,
    warn: <WarningAmberIcon style={{ color: 'white' }} />,
  };

  return (
    <div
      ref={customRef}
      className={`${colorSnackbar[type]}
            transition-opacity duration-200 animate-fadeInAnimation ${
              show ? 'opacity-1' : 'opacity-0'
            }
            flex justify-between items-center absolute pointer-events-auto overflow-hidden
            px-5 gap-5 py-3 w-full min-w-[300px] max-w-[300px] md:max-w-[650px] md:min-w-[600px] rounded-xl bg-no-repeat z-[9999]`}
      style={{ boxShadow: '0 0 10px #08050584' }}
      data-testid={'snackbarMessage-' + type}
    >
      <div className="flex flex-col w-8 h-6 justify-center items-center">
        {iconSnackbar[type]}
        <When
          value={type === 'warn'}
          render={<CheckCircleOutlineIcon style={{ color: 'white' }} />}
        />
      </div>
      <div className="flex flex-1 w-full justify-center items-center">
        <Text5 className={'2xl:leading-5 text-center w-full text-white'}>{message}</Text5>
      </div>
      <button
        data-testid={'closeIcon'}
        className={
          'flex cursor-pointer rounded-xl w-8 h-6 transform hover:scale-125 active:scale-90 justify-center items-center'
        }
        onClick={handleDeleteSnackbar}
      >
        <CrossIcon height="10" width="10" />
      </button>
    </div>
  );
};
