'use client';
import React, { ComponentProps, useState } from 'react';
import { useButton } from '../../Button/hooks/useButton';
import { ManageAnotherColumns } from '../components/ManageAnotherColumns';
import { TableMorePopover } from '..';

type Props = Omit<ComponentProps<typeof TableMorePopover>, 'show' | 'id'>;

export function useTableMorePopover({
  anchorEl,
  handleCloseMore,
  onColumnLabelToggle,
  allColumnLabels,
  selectedColumnLabels,
}: Props) {
  const { getAnimation } = useButton();
  const [currentOption, setCurrentOption] = useState<'manageColumns' | null>(null);
  const currentAnchorLabel = anchorEl?.parentElement?.parentElement?.children[0].innerHTML;

  const contentOptionsComponents = {
    manageColumns: (
      <ManageAnotherColumns
        allColumnLabels={allColumnLabels}
        selectedColumnLabels={selectedColumnLabels}
        onColumnLabelToggle={onColumnLabelToggle}
        currentColumnLabel={currentAnchorLabel}
      />
    ),
  };

  const contentOptionRender = currentOption ? contentOptionsComponents[currentOption] : null;

  function handleClose() {
    setTimeout(() => setCurrentOption(null), 200);
    handleCloseMore();
  }

  function handleHideColumn() {
    if (!currentAnchorLabel) return;
    onColumnLabelToggle(currentAnchorLabel);
    handleCloseMore();
  }

  const hasOnlyOneColumn = selectedColumnLabels?.length === 1;

  return {
    getAnimation,
    currentOption,
    setCurrentOption,
    contentOptionRender,
    handleClose,
    handleHideColumn,
    hasOnlyOneColumn,
  };
}
