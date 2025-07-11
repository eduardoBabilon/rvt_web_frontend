import { useEffect, useState } from 'react';

import { DataItem, DataKeys, SortDirection } from '@/utils/types';
import { ColumnConfig } from '../types';
import { validateCPF } from '@/utils/functions/validations';
import { onlyNumber } from '@/utils/formatters/masks';

type Props<T extends DataItem> = {
  columnsConfig: ColumnConfig<DataKeys<T>>[];
  columnsToFilter?: DataKeys<T>[];
  stringToFilter?: string;
  data?: T[];
};

export function useTable<T extends DataItem>({ columnsToFilter, stringToFilter, data }: Props<T>) {
  const [tableData, setTableData] = useState(data);
  const [sortField, setSortField] = useState<DataKeys<T>>('');
  const [order, setOrder] = useState<SortDirection>('asc');
  const [paginateItems, setPaginateItems] = useState<T[]>([]);

  useEffect(() => {
    function getTableDataFiltered() {
      if (stringToFilter && columnsToFilter) {
        const filteredData = [...(data ?? [])].filter((item) => {
          const values = columnsToFilter.map((column) => item[column]);

          return values.some((value) => {
            if(!value) return false;
            if (typeof value === 'object') return false;
            const formattedValue = value?.toString().toLowerCase().trim();
            const formattedFilter = stringToFilter.toLowerCase().trim();

            if (validateCPF(formattedValue)) {
              const hasLetters = /[a-zA-Z]/g.test(formattedFilter);
              if (hasLetters) return false;
              const numberFilter = onlyNumber(formattedFilter);
              if (numberFilter.length < 1) return false;

              return onlyNumber(formattedValue).includes(numberFilter);
            }
            return formattedValue.includes(formattedFilter);
          });
        });
        return filteredData;
      }
      return data;
    }

    const filteredData = getTableDataFiltered();
    setTableData(filteredData);
  }, [data, stringToFilter]);

  const handleSortingChange = (keyName: DataKeys<T>) => {
    const sortOrder = keyName === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(keyName);
    setOrder(sortOrder);
    handleSorting(keyName, sortOrder);
  };

  const handleSorting = (sortField: DataKeys<T>, sortOrder: SortDirection) => {
    if (sortField) {
      const sorted = [...(data ?? [])].sort((a, b) => {
        if (typeof a[sortField] === 'object' || typeof b[sortField] === 'object') return 0;
        if (!sortField) return 0;
        const [aValue, bValue] = [a[sortField], b[sortField]];

        if (!aValue || !bValue) return 0;

        return (
          aValue.toString().localeCompare(bValue.toString(), 'pt-BR', {
            numeric: true,
          }) * (sortOrder === 'asc' ? 1 : -1)
        );
      });
      setTableData(sorted);
    }
  };

  return {
    handleSortingChange,
    setPaginateItems,
    paginateItems,
    tableData,
  };
}
