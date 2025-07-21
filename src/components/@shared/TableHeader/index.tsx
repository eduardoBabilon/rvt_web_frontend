import React from 'react';

import { TableCell, TableHead, TableRow } from '@mui/material';
import { TableMorePopover } from '../TableMorePopover';
import { useTableHeader } from './hooks/useTableHeader';
import { GridMoreVertIcon } from '@mui/x-data-grid';
import { ColumnTableConfig } from '@/types/table';
import { ArrowUpDown } from '../ArrowUpDown';
import { Text6 } from '../Texts';
import { When } from '../When';

type Props<TField extends string, TLabel extends string, TData extends Record<string, any>> = {
  onSelectColumns: (selectedColumns: ColumnTableConfig<TField, TLabel, TData>[]) => void;
  columnsHeader: ColumnTableConfig<TField, TLabel, TData>[];
  onSortData?: (sortedData: TData[]) => void;
  withInitialSpacing?: boolean;
  originalData?: TData[];
  id?: string;
};

export function TableHeader<
  TField extends string = string,
  TLabel extends string = string,
  TData extends Record<string, any> = { [key: string]: any },
>({
  withInitialSpacing,
  id = 'tableHeader',
  onSelectColumns,
  columnsHeader,
  originalData,
  onSortData,
}: Props<TField, TLabel, TData>) {
  const {
    handleDisplayColumnLabelChange,
    selectedColumnsHeader,
    selectedColumnLabels,
    handleSortingChange,
    handleClickMore,
    handleCloseMore,
    allColumnLabels,
    anchorEl,
    showMore,
    sortOrder,
    sortField,
  } = useTableHeader({ columnsHeader, onSelectColumns, onSortData, originalData });
  return (
    <>
      <TableMorePopover
        id={id + '-openMore'}
        anchorEl={anchorEl}
        show={showMore}
        handleCloseMore={handleCloseMore}
        selectedColumnLabels={selectedColumnLabels}
        allColumnLabels={allColumnLabels}
        onColumnLabelToggle={(label) => handleDisplayColumnLabelChange(label as TLabel)}
      />
      <TableHead>
        <TableRow className="min-h-min">
          <When value={withInitialSpacing}>
            <TableCell className="p-0 w-full h-full flex flex-1" style={{ display: 'flex' }} />
          </When>

          {selectedColumnsHeader?.map(({ field, label }) => {
            const isCurrentFieldSorted = field === sortField;
            const arrowStates = {
              asc: 'down',
              desc: 'up',
            };

            const arrowState = (isCurrentFieldSorted ? arrowStates[sortOrder] : 'none') as
              | 'none'
              | 'up'
              | 'down';

            return (
              <TableCell key={field} align="left" className="min-h-min whitespace-nowrap font-bold">
                <div className="flex items-center gap-2">
                  <Text6>{label}</Text6>
                  <div className='flex items-center justify-center'>
                    <button
                      type="button"
                      onClick={() => handleSortingChange(label)}
                      className="rounded-full justify-center items-center hover:bg-gray-100 h-6 w-6 duration-200 active:bg-gray-200"
                    >
                      <ArrowUpDown arrowState={arrowState} />
                    </button>
                    <button
                      type="button"
                      onClick={handleClickMore}
                      className="rounded-full justify-center items-center hover:bg-gray-100 h-6 w-6 duration-200"
                    >
                      <GridMoreVertIcon style={{ fontSize: '16px' }} />
                    </button>
                  </div>
                </div>
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    </>
  );
}
