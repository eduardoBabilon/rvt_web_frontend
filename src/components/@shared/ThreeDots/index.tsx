import React from 'react';
import { Dot } from '../Dot';

export function ThreeDots() {
  return (
    <div className="flex justify-center w-fit items-center  gap-[3px]">
      <Dot size={2} />
      <Dot size={2}/>
      <Dot size={2}/>
    </div>
  );
}
