import React from 'react';

import { ColumnConfig } from '../../types';
import ArrowDownUpIcon from '@/assets/icons/ArrowDownUp';
import { twMerge } from 'tailwind-merge';

type Props<T> = {
  className?: string;
  columnsConfig: ColumnConfig<T>[];
  handleSortingChange?: (keyName: T) => void;
};

export function THead<T = string>({
  columnsConfig,
  className = '',
  handleSortingChange,
}: Props<T>) {
  const length = columnsConfig.reduce((acc, { columnSize }) => acc + (columnSize ?? 1), 0);
  return (
    <div className={twMerge(`grid grid-cols-${length} gap-3 w-full px-1 xl:px-8 mb-4`, className)}>
      {columnsConfig.map(({ label, keyName, columnSize, sortable, classNameHeader }, index) => (
        <div
          key={index}
          className={twMerge(
            `col-span-${columnSize} text-[#363843] font-bold uppercase flex flex-row gap-1 items-center`,
            classNameHeader,
          )}
        >
          <p>{label}</p>

          {sortable ? (
            <button
              className={'flex items-center bg-transparent'}
              onClick={() => handleSortingChange?.(keyName)}
              type={'button'}
            >
              {<ArrowDownUpIcon />}
            </button>
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  );
}
