import React from 'react';

import { ListPagination } from '../ListPagination';
import { DataItem, DataKeys } from '@/utils/types';
import { useTable } from './hooks/useTable';
import { THead } from './components/THead';
import { TRow } from './components/TRow';
import { ColumnConfig } from './types';

type Props<T extends DataItem> = {
  data?: T[];
  columnsConfig: ColumnConfig<DataKeys<T>>[];
  columnsToFilter?: DataKeys<T>[];
  alternateColor?: string;
  stringToFilter?: string;
  rowHeadClassName?: string;
  rowsClassName?: string;
  marginBotton?: number;
  itemsPerPage?: number;
  scrollToId?: string;
  renderEdit?: any;
};

export function Table<T extends DataItem>({
  rowHeadClassName,
  columnsToFilter,
  stringToFilter,
  alternateColor,
  columnsConfig,
  rowsClassName,
  marginBotton,
  itemsPerPage,
  renderEdit,
  scrollToId,
  data,
}: Props<T>) {
  const { handleSortingChange, setPaginateItems, paginateItems, tableData } = useTable({
    columnsToFilter,
    stringToFilter,
    columnsConfig,
    data,
  });

  return (
    <div className={`flex flex-col w-full gap-6 ${marginBotton ? `mb-${marginBotton}` : 'mb-10'}`}>
      <div className="flex flex-col">
        <THead<DataKeys<T>>
          handleSortingChange={handleSortingChange}
          columnsConfig={columnsConfig}
          className={rowHeadClassName}
        />
        {paginateItems.map((item, index) => {
          return (
            <TRow
              alternateColor={alternateColor}
              isOdd={(index + 1) % 2 === 1}
              columnsConfig={columnsConfig}
              className={rowsClassName}
              renderEdit={renderEdit}
              data={item}
              key={index}
            />
          );
        })}
      </div>
      <div className="flex justify-end px-6 w-full">
        <ListPagination
          setPageItems={setPaginateItems}
          defaultItemsPerPage={itemsPerPage}
          scrollToId={scrollToId}
          items={tableData}
        />
      </div>
    </div>
  );
}
