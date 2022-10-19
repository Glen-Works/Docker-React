import { Container, Grid } from '@mui/material';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableState } from "mui-datatables";
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { userListApi } from 'src/api/Sample/sampleDataTableApi';
import getDataTableState, { PageManagement, setPageManagement } from 'src/components/DataTableTheme/DataTableState';
import DataTableThemeProvider from 'src/components/DataTableTheme/DataTableThemeProvider';
import getTextLabels from 'src/components/DataTableTheme/TextLabels';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import PageHeader from '../PageBase/PageHeader';

function SampleDataTable() {

  const columns: MUIDataTableColumn[] = [
    {
      name: "id",
      label: "id",
      options: {
        sort: true,
      }
    },
    {
      name: "name",
      label: "name",
      options: {
        sort: true,
      }
    },
    {
      name: "email",
      label: "email",
      options: {
        sort: true,
      }
    },
    {
      name: "status",
      label: "status",
      options: {
        sort: true,
      }
    },
    {
      name: "userType",
      label: "userType",
      options: {
        sort: true,
      }
    },
    {
      name: "loginIp",
      label: "loginIp",
      options: {
        sort: true,
      }
    },
    {
      name: "loginTime",
      label: "loginTime",
      options: {
        sort: true,
      }
    },
    {
      name: "createdAt",
      label: "createdAt",
      options: {
        sort: true,
      }
    },
    {
      name: "updatedAt",
      label: "updatedAt",
      options: {
        sort: true,
      }
    },
  ];

  const { state } = useAuthStateContext();
  const [tableState, setTableState] = useState(getDataTableState());

  useEffect(() => {
    getData(null);
  }, []);

  function getData(ds: PageManagement | null) {
    userListApi(ds, state)
      .then(res => {
        setTableState({ data: res.data.userList, pageManagement: res.data.pageManagement });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  const changePage = (ds: MUIDataTableState) => {
    getData(setPageManagement(ds));
    // userListApi(setPageManagement(ds), state)
    //   .then(res => {
    //     setTableState({ data: res.data.userList, pageManagement: res.data.pageManagement });
    //   })
    //   .catch(error => {
    //     console.log("error:" + error.response?.data?.msg);
    //   });
  };

  let { count, limit, sort, sortColumn } = tableState.pageManagement;
  const options: MUIDataTableOptions = {
    search: false,
    print: false,
    filter: false,
    textLabels: getTextLabels(),
    serverSide: true,
    count: count,
    rowsPerPage: limit,
    // rowsPerPageOptions: [],
    sortOrder: { name: sortColumn, direction: sort },
    onTableChange: (action, tableState) => {
      // console.log(action, tableState);
      switch (action) {
        case 'changePage':
          changePage(tableState);
          break;
        case 'sort':
          changePage(tableState);
          break;
        default:
          console.log('action not handled.');
      }
    },
  };

  return (
    <>
      <Helmet>
        <title>Transactions - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth={false} >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <DataTableThemeProvider>
              <MUIDataTable
                title={"Sample List"}
                data={tableState.data}
                columns={columns}
                options={options}
              />
            </DataTableThemeProvider>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default SampleDataTable;
