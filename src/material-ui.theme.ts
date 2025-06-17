import { createTheme } from '@mui/material';

export const themeOptions = createTheme({
  palette: {
    primary: {
      main: '#804595',
      light: '#9c539c',
      dark: '#6a398c',
      contrastText: '#f8f8ff'
    },
    secondary: {
      main: '#D876A9',
      light: '#d876a9',
      contrastText: '#f8f8ff'
    },
    text: {
      primary: '#1A0616',
      secondary: '#A1999F',
      disabled: '#1A0616'
    },
    error: {
      main: '#DA2424'
    },
    warning: {
      main: '#C9A267'
    },
    success: {
      main: '#80C967'
    }
  },
  typography: {
    h4: {
      fontSize: 16
    },
    h2: {
      fontSize: 23,
      fontWeight: 400
    },
    h1: {
      fontSize: 28,
      fontWeight: 400
    },
    h3: {
      fontSize: 19
    },
    h5: {
      fontSize: 13
    },
    h6: {
      fontSize: 11
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true
      }
    }
  }
});
