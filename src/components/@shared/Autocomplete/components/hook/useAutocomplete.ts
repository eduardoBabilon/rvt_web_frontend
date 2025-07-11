import { MutableRefObject, useRef, useState } from 'react';

type Props = {
  onKeyDownProp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  customRef?: React.LegacyRef<HTMLInputElement>;
  preventEnterSubmit: boolean;
};

export function useAutocomplete({ customRef, preventEnterSubmit, onKeyDownProp }: Props) {
  const defaultRef = useRef<HTMLInputElement | null>(null);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (preventEnterSubmit && event.key === 'Enter') {
      event.preventDefault();
      onKeyDownProp?.(event);
    }
  }

  const autocompleteRef = (customRef || defaultRef) as MutableRefObject<HTMLInputElement | null>;

  return { autocompleteRef, onKeyDown };
}
