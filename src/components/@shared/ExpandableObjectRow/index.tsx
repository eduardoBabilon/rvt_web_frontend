import React, { useEffect, useRef, useState } from 'react';
import { Text5 } from '../Texts';
import { ExpandableDiv } from '../ExpandableDiv';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';

type Props = {
  object: { [key: string]: any } | null;
  onToggleExpand?: (isExpanded: boolean) => void;
};

export function ExpandableObjectRecursiveRow({ object, onToggleExpand }: Props) {
  const entries = Object.entries(object ?? {});
  const [isExpanded, setIsExpanded] = React.useState(false);

  function toggleExpand() {
    setIsExpanded(!isExpanded);
  }

  useEffect(() => {
    onToggleExpand?.(isExpanded);
  }, [isExpanded]);

  return (
    <div className="flex flex-col w-full border ">
      {entries.map(([key, value]) => {
        if (value instanceof Object) {
          return (
            <div key={key} className="flex flex-col border border-t border-b p-2 h-fit">
              <button onClick={toggleExpand} className="flex h-5 justify-center items-center w-fit">
                <Text5>{key}</Text5>
                <span
                  className={`transition transform ${isExpanded ? '-scale-y-100' : 'scale-y-100'}`}
                >
                  <ArrowDropDownIcon />
                </span>
              </button>
              <ExpandableDiv
                duration={0}
                onToggleExpand={() => {
                  onToggleExpand?.(isExpanded);
                }}
                isExpanded={isExpanded}
              >
                {({ handleHeight }) => {
                  return (
                    <div className="pl-2">
                      <ExpandableObjectRecursiveRow onToggleExpand={handleHeight} object={value} />
                    </div>
                  );
                }}
              </ExpandableDiv>
            </div>
          );
        }
        return (
          <div key={key} className="flex gap-2 border border-t border-b p-2">
            <Text5 className="text-text-primary">{key + ':'}</Text5>
            <Text5 className="text-text-primary">{value.toString()}</Text5>
          </div>
        );
      })}
    </div>
  );
}
