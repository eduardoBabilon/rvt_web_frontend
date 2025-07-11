import React from 'react';

import { useButton } from '@/components/@shared/Button/hooks/useButton';
import { twMerge } from 'tailwind-merge';
import { Text5, Text6 } from '@/components/@shared/Texts';

type Props = {
  isSelected?: boolean;
  label: string | number;
  onClick: () => void;
};

export function ButtonPage({ isSelected = false, label, onClick }: Props) {
  const { getAnimation } = useButton();
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'flex h-6 w-6 justify-center items-center rounded-[4px] ',
        getAnimation(),
        isSelected ? ' text-text-primary font-bold' : ' text-[#8d8d8d]',
        ' hover:opacity-50',
      )}
    >
      <Text6>{label.toString()}</Text6>
    </button>
  );
}
