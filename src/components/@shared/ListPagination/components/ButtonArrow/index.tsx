import ArrowLeftIcon from '@/assets/icons/ArrowLeft';
import { useButton } from '@/components/@shared/Button/hooks/useButton';
import colors from '@/styles/Theme/colors';
import React from 'react';
import { twJoin } from 'tailwind-merge';

type Props = {
  onClick: () => void;
  direction?: 'left' | 'right';
  isEnabled?: boolean;
};

export function ButtonArrow({ direction, onClick, isEnabled }: Props) {
  const { primary } = colors.text;
  const { getAnimation } = useButton();
  return (
    <button
      disabled={!isEnabled}
      onClick={onClick}
      className={twJoin(
        'flex h-6 w-6 justify-center items-center rounded-md',
        direction === 'right' ? 'rotate-180' : '',
        isEnabled ? getAnimation() : 'opacity-50',
      )}
    >
      <ArrowLeftIcon fill={primary} height="10" width="10" />
    </button>
  );
}
