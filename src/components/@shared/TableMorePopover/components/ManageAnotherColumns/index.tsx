import React from 'react';
import { Checkbox } from '@mui/material';

type Props = {
  onColumnLabelToggle?: (label: string) => void;
  selectedColumnLabels?: string[];
  allColumnLabels?: string[];
  currentColumnLabel?: string;
};

export function ManageAnotherColumns({
  allColumnLabels,
  selectedColumnLabels,
  onColumnLabelToggle,
  currentColumnLabel,
}: Props) {
  const allOtherColumns = allColumnLabels?.filter((label) => label !== currentColumnLabel);

  return (
    <div className="grid grid-cols-2">
      {allOtherColumns?.map((label) => (
        <button
          type="button"
          className="flex gap-1 items-center"
          onClick={() => onColumnLabelToggle?.(label)}
          key={label}
        >
          <Checkbox checked={selectedColumnLabels?.includes(label)} />
          {label}
        </button>
      ))}
    </div>
  );
}
