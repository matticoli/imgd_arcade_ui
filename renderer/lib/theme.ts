import {createTheme, ThemeOptions } from '@mui/material/styles';
// import PixeloidSansWoff from './fonts/PixeloidSans.woff';

// Create a theme instance.
const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
          main: '#ac2a38',
          dark: '#4285ce',
        },
        secondary: {
          main: '#4285ce',
        },
    },
    typography: {
        fontFamily: 'PixeloidSans',
    },
    components: {
        MuiCssBaseline: {
          styleOverrides: `
            @font-face {
              font-family: 'PixeloidSans';
              font-style: normal;
              font-display: swap;
              font-weight: 400;
              src: local('PixeloidSans'), local('PixeloidSans-Regular'), url(/fonts/PixeloidSans.woff) format('woff');
              unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
            }
          `,
        },
    },
});

export default theme;