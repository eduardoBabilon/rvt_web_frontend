import colors from '@/styles/Theme/colors';
import {
  ThemeProvider,
  createTheme,
  PaletteColor,
  SimplePaletteColorOptions,
  BreakpointOverrides,
} from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    custom?: typeof colors;
  }

  interface BreakpointOverrides {
    xxs: true;
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    hd: true;
    fullHd: true;
  }
}
