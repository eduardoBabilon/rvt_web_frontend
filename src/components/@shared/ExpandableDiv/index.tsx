import React, { ReactNode } from 'react';
import { useExpandableDiv } from './hooks/useExpandableDiv';

type Props = {
  isExpanded?: boolean;
  minHeight?: string;
  children: ReactNode | (({ handleHeight }: { handleHeight: () => void }) => ReactNode);
  translateY?: boolean;
  transitionType?: 'ease-linear' | 'ease-in-out';
  duration?: number;
  onToggleExpand?: () => void;
};

export function ExpandableDiv({
  isExpanded = true,
  minHeight = '0px',
  children,
  translateY = true,
  duration = 200,
  transitionType = 'ease-linear',
  onToggleExpand,
}: Props) {
  const { divRef, height, handleHeight } = useExpandableDiv({ isExpanded, onToggleExpand });
  return (
    <div className="flex h-fit w-full ">
      <div
        className={`flex origin-top-center h-fit w-full ${transitionType} overflow-hidden `}
        style={{
          maxHeight: isExpanded ? `${height}px` : minHeight,
          transitionDuration: `${duration}ms`,
        }}
      >
        <div
          ref={divRef}
          className={`flex origin-top-center h-fit w-full transition-all ease-linear 
          ${
            isExpanded
              ? ` max-h-[9999px] ${translateY ? 'translate-y-0' : ''}`
              : ` max-h-0 ${translateY ? '-translate-y-full' : ''}`
          }`}
          style={{
            transitionDuration: `${duration}ms`,
          }}
        >
          {typeof children === 'function' ? children({ handleHeight }) : children}
        </div>
      </div>
    </div>
  );
}
