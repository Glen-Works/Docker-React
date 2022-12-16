import { createTheme, ThemeProvider } from '@mui/material/styles';

const fontStyles = [
  'sourceCircle',
  'Inter',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  'Helvetica',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(',');

const theme = (Theme) =>
  createTheme({
    ...Theme,
    typography: {
      ...Theme.typography,
      // ...Theme.typography,
      fontFamily: fontStyles,

    },
    components: {
      ...Theme.components,
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: fontStyles,
          }
        }
      }
    }
  });


function FontStyle(props) {

  return (
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  );
}
export default FontStyle;
