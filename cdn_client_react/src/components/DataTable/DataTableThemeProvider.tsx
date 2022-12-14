import { createTheme, ThemeProvider } from '@mui/material/styles';

const TableTheme = (Theme) =>
  createTheme({
    ...Theme,
    components: {
      ...Theme.components,
      MUIDataTable: {
        styleOverrides: {
          paper: {
            // border: "none",
            marginTop: '25px',
            boxShadow: "0.8px 0.8px 10px 1px " + Theme.colors.alpha.black[30],
            borderRadius: 25,
          },
        },
      }, MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '14px',
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
