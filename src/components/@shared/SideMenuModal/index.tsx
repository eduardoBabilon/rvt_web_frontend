import React from 'react';

import { useSideMenuModal } from './hooks/useSideMenuModal';
import { doNothing } from '@/utils/functions/general';
import Logo from '../../../assets/svgs/logo-mills.svg';
import CrossIcon from '@/assets/icons/Cross';
import { When } from '../When';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  children: React.ReactNode;
  closeOnBackDrop?: boolean;
  closeMenu: () => void;
  zIndex?: number;
  show: boolean;
};

export function SideMenuModal({ closeOnBackDrop, zIndex = 100, closeMenu, children, show }: Props) {
  const { isOpen, activeEffects } = useSideMenuModal({ show });

  return (
    <When value={isOpen}>
      <div style={{ zIndex }} className="fixed inset-0 flex justify-start">
        <div
          className={`${
            activeEffects ? 'opacity-70' : 'opacity-0'
          } fixed top-0 left-0 w-screen h-screen bg-black transition-all ease-linear duration-75`}
          onClick={closeOnBackDrop ? closeMenu : doNothing}
        />
        <div
          className={`absolute w-[90%] md:w-[40%] max-w-[450px] h-screen transform transition-all origin-left ease-linear duration-200 bg-white
          ${
            activeEffects
              ? ' max-w-[450px] translate-x-0 scale-x-100'
              : '-translate-x-full scale-x-0 max-w-0'
          } 
          overflow-auto`}
        >
          <div
            className={`w-full transform transition-all origin-left ease-linear duration-75 flex flex-col h-full ${
              activeEffects ? 'scale-x-100 max-w-[9999px]' : 'scale-x-0 max-w-0'
            } `}
          >
            <div className="flex w-full items-center justify-between py-2 px-5 transform transition-all origin-left ease-linear duration-75 bg-brand-primary h-[65px] text-text-primary">
              <div className='flex max-w-[40px] w-full'/>
              <div className="flex justify-center w-full">
                <Link href="/">
                  <Image src={Logo} alt="logo" priority />
                </Link>
              </div>
              <div>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex justify-center items-center w-10"
                >
                  <CrossIcon />
                </button>
              </div>
            </div>
            <div className="flex flex-col flex-1 h-full">{children}</div>
          </div>
        </div>
      </div>
    </When>
  );
}
