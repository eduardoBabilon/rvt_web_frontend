import React from 'react';

import { doNothing } from '@/utils/functions/general';
import { twMerge } from 'tailwind-merge';

export type CustomRadioProps = {
  sizePx?: number;
  gapPx?: number;
};

type Props = CustomRadioProps & {
  containerClassName?: string;
  children?: React.ReactNode;
  backgroundColor?: string;
  radioClassName?: string;
  isDisabled?: boolean;
  onClick?: () => void;
  checked: boolean;
  name: string;
  value?: any;
};

export function InputRadio({
  containerClassName,
  radioClassName,
  sizePx = 20,
  gapPx = 12,
  children,
  checked,
  onClick,
  value,
  name,
  backgroundColor = '',
  isDisabled,
}: Props) {
  const gapNormalized = gapPx.toString() + 'px';
  const sizeNormalized = sizePx.toString() + 'px';
  const SIZE_OF_SELECTED = (sizePx - sizePx / 2).toString() + 'px';
  return (
    <div
      className={twMerge(
        `flex items-center relative mb-3 select-none text-text-semiLight`,
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer',
        containerClassName,
      )}
      style={{ gap: gapNormalized }}
      onClick={() => {
        if (isDisabled) return;
        onClick?.();
      }}
    >
      <span
        className={twMerge(
          `flex justify-center items-center relative transition-all ease-in-out duration-200 rounded-full border-2 border-solid 
        ${checked ? 'border-brand-primary' : 'border-borderColor-primary'} 
        `,
          radioClassName,
        )}
        style={{
          minWidth: sizeNormalized,
          minHeight: sizeNormalized,
          backgroundColor,
          maxWidth: sizeNormalized,
          maxHeight: sizeNormalized,
        }}
      >
        <span
          style={{
            minWidth: SIZE_OF_SELECTED,
            minHeight: SIZE_OF_SELECTED,
            maxWidth: SIZE_OF_SELECTED,
            maxHeight: SIZE_OF_SELECTED,
          }}
          className={`relative transform transition-transform ease-in-out duration-200 rounded-full 
          ${checked ? 'bg-brand-primary' : 'border-borderColor-primary'}
          ${checked ? 'scale-100' : 'scale-0'} `}
        />
      </span>
      {children}
      <input
        className="hidden opacity-0 cursor-pointer"
        onChange={doNothing}
        checked={checked}
        type={'checkbox'}
        value={value}
        name={name}
      />
    </div>
  );
}
