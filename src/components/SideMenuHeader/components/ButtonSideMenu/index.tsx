'use client';

import { Text5, Text6 } from '@/components/@shared/Texts';
import { When } from '@/components/@shared/When';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  onClick: () => void;
  text: string;
  isDisabled?: boolean;
  tag?: 'coming-soon' | 'new';
  isSelected?: boolean;
};

export function ButtonSideMenu({ onClick, text, isDisabled, tag, isSelected }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={twMerge(
        `flex justify-start items-center py-4 w-full hover:bg-gray-100 duration-200 transition-all px-6 cursor-pointer`,
        isDisabled ? 'cursor-not-allowed opacity-20' : 'opacity-100 gap-5',
        tag === 'coming-soon' ? 'cursor-auto' : 'cursor-pointer',
        isSelected ? 'bg-gray-100 cursor-auto' : '',
      )}
    >
      <Text5 className={tag === 'coming-soon' ? 'opacity-40' : 'opacity-100'}>{text}</Text5>
      <When value={tag === 'coming-soon'}>
        <span className="flex justify-center items-center bg-brand-primary rounded-full fit h-fit py-1 px-2">
          <Text6 className="text-white text-[10px] xl:text-[12px]">Em breve</Text6>
        </span>
      </When>
      <When value={tag === 'new'}>
        <span className="flex justify-center items-center bg-brand-primary rounded-full fit h-fit py-1 px-2">
          <Text6 className="text-white text-[10px] xl:text-[12px]">Novo !</Text6>
        </span>
      </When>
    </button>
  );
}
