'use client';
import React, { ReactNode } from 'react';

import { getCapitalizedAllString } from '@/utils/functions/string';
import LogoImage from '@/assets/svgs/logo-mills.svg';
import { SideMenuHeader } from '../SideMenuHeader';
import { useAuthContext } from '@/contexts/Auth';
import { Text5 } from '../@shared/Texts';
import { When } from '../@shared/When';
import Image from 'next/image';

type Props = {
  children?: ReactNode;
};

export function Header({ children }: Props = {}) {
  const { user, isAuthenticated } = useAuthContext();

  const name = user?.name;
  const capitalizedName = getCapitalizedAllString(name);
  const nameParts = capitalizedName.split(' ');
  const firstName = nameParts[0];

  return (
    <>
      <div className="flex w-full h-[64px] overflow-hidden bg-brand-primary">
        <div className="flex w-full h-[64px] overflow-hidden bg-brand-primary text-white fixed z-50 shadow-lg">
          <div className="grid grid-cols-3 h-[64px] mx-8 items-center w-full">
            <When
              value={isAuthenticated}
              render={<SideMenuHeader />}
              elseRender={<div className="flex w-full h-1" />}
            />
            <div className="flex items-center h-full justify-center md:w-full md:justify-center">
              <div className="flex w-[60px] md:w-[75px] relative bottom-[3px]">
                <Image src={LogoImage} alt="logo mills" priority />
              </div>
            </div>
            <When
              value={isAuthenticated}
              render={
                <div className="flex justify-end w-full h-full items-center">
                  <Text5 className="w-fit h-fit">{`Olá, ${firstName}`}</Text5>
                </div>
              }
              elseRender={<div className="flex w-full h-1" />}
            />
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
