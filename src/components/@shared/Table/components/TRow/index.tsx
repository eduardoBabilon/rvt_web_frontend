import React, { useState } from 'react';

import colors from '@/styles/Theme/colors';
import { Column, ColumnConfig } from '../../types';
import { DataItem, DataKeys } from '@/utils/types';
import { twMerge } from 'tailwind-merge';

type Props<T extends DataItem> = {
  alternateColor?: string;
  columnsConfig: ColumnConfig<DataKeys<T>>[];
  className?: string;
  renderEdit?: any;
  isOdd?: boolean;
  data?: T;
};

const { brandLight: brandLightColor } = colors.background;
export function TRow<T extends DataItem>({
  columnsConfig,
  isOdd,
  alternateColor = brandLightColor,
  className = '',
  renderEdit,
  data,
}: Props<T>) {
  const [active, setActive] = useState(false);
  const length = columnsConfig.reduce((acc, { columnSize }) => acc + (columnSize ?? 1), 0);
  const editable = renderEdit && renderEdit() && active;

  return (
    <div
      className="flex flex-row max-w-full h-fit min-w-fit"
      onMouseOver={() => setActive(true)}
      onMouseOut={() => setActive(false)}
    >
      <div
        style={{
          backgroundColor: isOdd ? alternateColor : '',
          width: '100%',
        }}
        className={twMerge(
          `grid grid-cols-${length} items-center justify-center max-w-full min-w-fit h-fit gap-3 rounded-md py-5 px-3 xl:px-8`,
          className,
        )}
      >
        {columnsConfig.map(({ columnSize = 1, render, keyName, classNameCell }, index) => {
          if (!data) return null;

          function DefaultRenderCell(props: { text: string }) {
            return (
              <p
                className={`text-table-text-normal h-full text-[14px] min-w-fit flex-wrap break-words text-wrap ${classNameCell} `}
              >
                {props.text}
              </p>
            );
          }

          function renderCell() {
            const value = data?.[keyName];

            if (render) {
              const renderResult = render?.(value);

              if (typeof renderResult === 'string') {
                return <DefaultRenderCell text={renderResult} />;
              }
              return renderResult;
            }

            if (typeof value !== 'string') return null;

            return <DefaultRenderCell text={render ? '[object Object]' : value} />;
          }

          return (
            <div
              key={index}
              id={'table-column-' + index}
              className={`flex col-span-${columnSize} min-w-fit h-fit`}
            >
              {renderCell()}
            </div>
          );
        })}
      </div>
      {editable ? renderEdit({ columnsConfig, data }) : null}
    </div>
  );
}
