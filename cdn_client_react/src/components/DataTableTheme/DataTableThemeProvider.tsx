import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';


declare module '@mui/material/styles' {
  interface Components {
    [key: string]: any
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    MUIDataTableBodyCell?: {
      styleOverrides: {
        root?: {
          backgroundColor: String,
        },
      },
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    MUIDataTableBodyCell?: {
      styleOverrides: {
        root?: {
          backgroundColor: String,
        },
      },
    }

  }
}

const DataTableThemeProvider: React.FC = (props) => {

  return (
    <>
      <ThemeProvider theme={(baseTheme: Theme) =>
        createTheme({
          ...baseTheme,
          components: {
            ...baseTheme.components,
            MUIDataTableBodyCell: {
              styleOverrides: {
                root: {
                  backgroundColor: '#FFFFFF',
                },
              },
            },
          },
        })
      }
      >
        {props.children}
      </ThemeProvider>
    </>
  );
}

export default DataTableThemeProvider;
