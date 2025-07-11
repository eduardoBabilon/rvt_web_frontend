export type ColumnTableConfig<TFields extends string = string, TLabels extends string = string, TData = any> = {
  label: TLabels | ReactElement;
  field: TFields;
  align?: 'left' | 'right' | 'center';
  renderCell: ({ value, data }: { value: string | Date | number; data: TData }) => JSX.Element;
};