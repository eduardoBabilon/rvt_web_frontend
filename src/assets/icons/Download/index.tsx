import colors from '@/styles/Theme/colors';
import { CustomIconProps } from '@/utils/types';
import React from 'react';

const { primary: primaryColor } = colors.brand;

export default function DownloadIcon({
  fill = primaryColor,
  width = '16',
  height = '16',
  hoverAnimate,
}: CustomIconProps) {
  const viewBox = `0 0 16 16`;
  return (
    <svg
      className={hoverAnimate ? `hover:opacity-70 duration-200 cursor-pointer` : ``}
      xmlns={'http://www.w3.org/2000/svg'}
      viewBox={viewBox}
      height={height}
      width={width}
      fill={'none'}
    >
      <path
        d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14L0 11H2V14H14V11H16V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2ZM8 12L3 7L4.4 5.55L7 8.15V0L9 0V8.15L11.6 5.55L13 7L8 12Z"
        fill={fill}
      />
    </svg>
  );
}
