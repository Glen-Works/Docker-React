import { createTheme, ThemeProvider } from '@mui/material/styles';

const TableTheme = (Theme) =>
  createTheme({
    ...Theme,
    components: {
      ...Theme.components,
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
          },
        },
      }/*, MUIDataTableBodyRow: {
        styleOverrides: {
          root: {
            backgroundColor: 'red',
            "& td": {
              border: 'none',
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
              borderBottomColor: 'rgba(34, 51, 84, 0.1)'
            },
          },
        },
      }*/, MUIDataTableResize: {
        styleOverrides: {
          root: {
            "& div": {
              width: '3px',
              height: '20px',
              paddingTop: '23px',
            },
          }, resizer: {
            backgroundColor: 'rgba(224, 224, 224, 1)',
            '&:hover, &:focus, &:active': { background: 'black', width: '5px' },
          }
        },
      }, MUIDataTableFooter: {
        styleOverrides: {
          root: {
            "& td": { border: 'none' }
          },
        },
      }

    },
  });

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
