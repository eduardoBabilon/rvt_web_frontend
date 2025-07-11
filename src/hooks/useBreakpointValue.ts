import { Breakpoint, Theme, useMediaQuery } from '@mui/material';

export function useBreakpointValue(values: {
  [key in Breakpoint]?: any;
}) {
  const matches = {
    xs: useMediaQuery<Theme>((theme) => theme.breakpoints.up(`xs`)),
    sm: useMediaQuery<Theme>((theme) => theme.breakpoints.up(`sm`)),
    md: useMediaQuery<Theme>((theme) => theme.breakpoints.up(`md`)),
    lg: useMediaQuery<Theme>((theme) => theme.breakpoints.up(`lg`)),
    xl: useMediaQuery<Theme>((theme) => theme.breakpoints.up(`xl`)),
  };

  const validBreakpoints = Object.entries(matches)
    .filter(([breakpoint, isMatch]) => Object.keys(values).includes(breakpoint) && isMatch)
    .map(([key]) => key);

  const largestBreakpoint = validBreakpoints.pop();

  if (!largestBreakpoint) {
    return values[0];
  }

  return values[largestBreakpoint];
}
