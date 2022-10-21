import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Components {
    [key: string]: any
  }
}

/*declare module '@mui/material/styles' {
  interface Theme {
    MUIDataTable: {
      styleOverrides: {
        paper: {
          borderRadius: number,
       },
      },
    },MUIDataTableToolbar: {
      styleOverrides: {
        root: {
          padding: string,
        },titleText: {
          fontWeight: string,
       },
      },
    },MUIDataTableFooter: {
      styleOverrides: {
        root: {
          "& td": { border: string }
        },
      },
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    MUIDataTable: {
      styleOverrides: {
        paper: {
          borderRadius: number,
       },
      },
    },MUIDataTableToolbar: {
      styleOverrides: {
        root: {
          padding: string,
        },titleText: {
          fontWeight: string,
       },
      },
    },MUIDataTableFooter: {
      styleOverrides: {
        root: {
          "& td": { border: string }
        },
      },
    }

  }
}*/

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

const TableTheme = (baseTheme: Theme) =>
  createTheme({
    ...baseTheme,
    components: {
      ...baseTheme.components,
      MUIDataTable: {
        styleOverrides: {
          paper: {
            borderRadius: 25,
          },
        },
      }, MUIDataTableToolbar: {
        styleOverrides: {
          root: {
            margin: '0px 27px 0px 27px',
            paddingTop: '10px !important',
          }, titleText: {
            //fontWeight: 'bold',
          },
        },
      }/*,MUIDataTableBodyRow: {
        styleOverrides: {
          root: {
            "& td": { 
              border: 'none', 
              borderBottom: '1px solid rgba(224, 224, 224, 1)', 
              borderBottomColor: 'rgba(34, 51, 84, 0.1)' 
            },
          },
        },
      }*/,MUIDataTableResize: {
        styleOverrides: {
          root: {
            "& div": {
              width: '3px',
              height: '20px',
              paddingTop: '23px',
              '&:hover, &:focus': { background: "black" },
              '&:active': { opacity: 0 },
            },
          },resizer:{
            backgroundColor: 'rgba(224, 224, 224, 1)',
          }
        },
      },MUIDataTableFooter: {
        styleOverrides: {
          root: {
            "& td": { border: 'none' }
          },
        },
      }

    },
  })

const DataTableThemeProvider: React.FC = (props) => {

  return (
    <>
      <ThemeProvider theme={TableTheme}>
        {props.children}
      </ThemeProvider>
    </>
  );
}

export default DataTableThemeProvider;
