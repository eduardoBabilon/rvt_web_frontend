export type Column<T = string> = {
  columnSize?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  render?: (value: any) => JSX.Element | string;
  className?: string;
  keyName: T;
  value: unknown;
  sortable?: boolean;
};

export type ColumnConfig<T = string> = {
  columnSize?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  render?: (value: any) => JSX.Element;
  classNameCell?: string;
  classNameHeader?: string;
  keyName: T;
  label: string;
  sortable?: boolean;
};

export type ColumnHeadConfig<T = string> = {
  columnSize?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  render?: (value: any) => JSX.Element;
  keyName: T;
  label: string;
  sortable?: boolean;
};

export type ColumnStyle<T = string> = {
  className: string;
  keyName: T;
};

export type ColumnHeadStyle<T = string> = {
  className: string;
  keyName: T;
};
