import { ComponentProps, useEffect, useState } from 'react';
import { ColumnTableConfig } from '@/@types/table';
import { SortDirection } from '@/utils/types';
import { TableHeader } from '..';

type Props<TField extends string, TLabel extends string, TData extends Record<string, any>> = Omit<
  ComponentProps<typeof TableHeader<TField, TLabel, TData>>,
  'handleDisplayColumnLabelChange' | 'id'
>;

export function useTableHeader<
  TField extends string,
  TLabel extends string,
  TData extends Record<string, any>,
>({ columnsHeader, onSelectColumns, onSortData, originalData }: Props<TField, TLabel, TData>) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [sortField, setSortField] = useState<TField | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortDirection>('none');
  const [selectedColumnsHeader, setSelectedColumnsHeader] = useState<
    ColumnTableConfig<TField, TLabel, TData>[] | undefined
  >(columnsHeader);
  const showMore = Boolean(anchorEl);

  function handleClickMore(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMore() {
    setAnchorEl(null);
  }

  const handleSortingChange = (label: TLabel) => {
    const fieldName = columnsHeader.find((column) => column.label === label)?.field;
    if (!fieldName) return;

    const nextSortOrder = {
      asc: 'desc',
      desc: 'none',
      none: 'asc',
    } as Record<SortDirection, SortDirection>;

    const newSortOrder = nextSortOrder[sortOrder];
    setSortField(fieldName);
    setSortOrder(newSortOrder);
    handleSorting(fieldName, newSortOrder);
  };

  const handleSorting = (fieldName: TField, sortOrder: SortDirection) => {
    if (!fieldName) return;
    if (!originalData) return onSortData?.([]);
    if (sortOrder === 'none') return onSortData?.(originalData);
    const sorted = [...(originalData ?? [])].sort((a, b) => {
      return (
        (a[fieldName]?.toString() ?? '').localeCompare(b[fieldName]?.toString() ?? '', 'pt-BR', {
          numeric: true,
        }) * (sortOrder === 'asc' ? 1 : -1)
      );
    });
    onSortData?.(sorted);
  };

  const selectedColumnLabels = selectedColumnsHeader?.map((column) => column.label);
  const allColumnLabels = columnsHeader?.map((column) => column.label);

  function handleDisplayColumnLabelChange(label: TLabel) {
    if (!selectedColumnsHeader) return;
    const isLabelSelected = selectedColumnLabels?.includes(label);

    if (isLabelSelected) {
      const newSelectedColumns = selectedColumnsHeader?.filter((column) => column.label !== label);
      setSelectedColumnsHeader(newSelectedColumns);
    } else {
      const newSelectedColumns = columnsHeader.filter((column) =>
        [label, ...(selectedColumnLabels ?? [])].includes(column.label),
      );
      if (!newSelectedColumns) return;
      setSelectedColumnsHeader(newSelectedColumns);
    }
  }

  useEffect(() => {
    if (!selectedColumnsHeader) return;
    onSelectColumns(selectedColumnsHeader);
  }, [selectedColumnsHeader]);

  useEffect(() => {
    function handleSortingOnMount() {
      if (!sortField) return;
      handleSorting(sortField, sortOrder);
    }
    handleSortingOnMount();
  }, [originalData, sortField, sortOrder]);

  return {
    handleDisplayColumnLabelChange,
    selectedColumnsHeader,
    selectedColumnLabels,
    handleSortingChange,
    handleCloseMore,
    handleClickMore,
    allColumnLabels,
    sortOrder,
    sortField,
    anchorEl,
    showMore,
  };
}
