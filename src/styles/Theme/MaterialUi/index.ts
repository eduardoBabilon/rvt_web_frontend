import { createTheme } from '@mui/material';
import colors from '../colors';
import { ptBR } from '@mui/material/locale'

const { brand, alerts } = colors;

const { primary: primaryColor } = brand;
const { red: errorColor } = alerts;

export const theme = createTheme(
  {
    typography: {
      fontFamily: ['IBM Plex Sans', 'Roboto', 'Arial', 'sans-serif'].join(','),
    },
    palette: {
      mode: 'light',
      primary: {
        main: colors.brand.primary,
        light: colors.brand.primaryLight,
        contrastText: colors.brand.white,
      },
      secondary: {
        main: colors.brand.secondary,
      },
      error: {
        main: colors.alerts.red,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.light,
      },
      background: {
        default: colors.background.brandLight,
        paper: colors.background.primary,
      },
      custom: colors,
    },
    breakpoints: {
      values: {
        xxs: 0,
        xs: 320,
        sm: 480,
        md: 768,
        lg: 992,
        xl: 1028,
        hd: 1440,
        fullHd: 1920,
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E0E0E0',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryColor,
            },
            '& .Mui-error .MuiOutlinedInput-notchedOutline': {
              color: errorColor,
              borderColor: errorColor,
              borderWidth: '2px',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E0E0E0',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E0E0E0',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryColor,
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            '&.Mui-focused': {
              color: primaryColor,
            },
            '&.Mui-error': {
              color: errorColor,
            },
          },
        },
      },
    },
  },
  ptBR,
);

export default theme;

