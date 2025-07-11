import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  isExpanded: boolean;
  onToggleExpand?: any;
};

export function useExpandableDiv({ isExpanded, onToggleExpand }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const handleHeight = useCallback(() => {
    if (!divRef.current) return;
    const { scrollHeight } = divRef.current;
    setHeight(scrollHeight);
  }, [height, divRef.current, setHeight, onToggleExpand]);

  useEffect(() => {
    window.addEventListener('resize', handleHeight);
    handleHeight();
    return () => {
      window.removeEventListener('resize', handleHeight);
    };
  }, [divRef.current, isExpanded, onToggleExpand]);

  useEffect(() => {
    onToggleExpand?.();
  }, [height]);

  return { divRef, height, handleHeight };
}
