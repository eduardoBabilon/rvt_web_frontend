import React from 'react';

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TableRowsIcon from '@mui/icons-material/TableRows';
import Popover from '@mui/material/Popover';
import { twMerge } from 'tailwind-merge';
import { Text6 } from '../Texts';
import { When } from '../When';
import { useTableMorePopover } from './hooks/useTableMorePopover';

type Props = {
  onColumnLabelToggle: (label: string) => void;
  anchorEl: HTMLButtonElement | null;
  selectedColumnLabels?: string[];
  handleCloseMore: () => void;
  allColumnLabels?: string[];
  show: boolean;
  id?: string;
};

export function TableMorePopover({
  selectedColumnLabels,
  onColumnLabelToggle,
  handleCloseMore,
  id = 'openMore',
  allColumnLabels,
  anchorEl,
  show,
}: Props) {
  const {
    contentOptionRender,
    setCurrentOption,
    handleHideColumn,
    hasOnlyOneColumn,
    currentOption,
    getAnimation,
    handleClose,
  } = useTableMorePopover({
    selectedColumnLabels,
    onColumnLabelToggle,
    handleCloseMore,
    allColumnLabels,
    anchorEl,
  });

  return (
    <>
      <Popover
        id={id + '-popover'}
        open={show}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className="flex flex-col justify-center items-start p-4 gap-2">
          <When value={!currentOption}>
            <button
              className={twMerge('flex gap-2 items-center', getAnimation())}
              onClick={() => setCurrentOption('manageColumns')}
            >
              <TableRowsIcon style={{ fontSize: '16px' }} />
              <Text6>{'Gerenciar outras colunas'}</Text6>
            </button>
            <button
              disabled={hasOnlyOneColumn}
              className={twMerge('flex gap-2 items-center', getAnimation(hasOnlyOneColumn))}
              onClick={handleHideColumn}
            >
              <VisibilityOffIcon style={{ fontSize: '16px' }} />
              <Text6>{'Esconder coluna'}</Text6>
            </button>
          </When>
          <When value={currentOption}>
            <div className="flex flex-col gap-3">
              <div className="flex w-full items-center">
                <button
                  type="button"
                  className="flex gap-1 justify-center items-center"
                  onClick={() => setCurrentOption(null)}
                >
                  <span className="flex justify-center items-center">
                    <ArrowBackIcon style={{ fontSize: '16px' }} />
                  </span>
                  <Text6>{'Voltar'}</Text6>
                </button>
              </div>
              {contentOptionRender}
            </div>
          </When>
        </div>
      </Popover>
    </>
  );
}
