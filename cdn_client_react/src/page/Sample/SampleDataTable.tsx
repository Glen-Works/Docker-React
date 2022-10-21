import { Box, Button, CircularProgress, Container, Grid, Typography, useTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableState } from "mui-datatables";
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from "react-hook-form";
import { userListApi } from 'src/api/Sample/sampleDataTableApi';
import { customBodySwitchBool, customBodyTime } from 'src/components/DataTableTheme/CustomerRender';
import getDataTableState, { PageManagement, Search, setPageManagement } from 'src/components/DataTableTheme/DataTableState';
import DataTableThemeProvider from 'src/components/DataTableTheme/DataTableThemeProvider';
import getTextLabels from 'src/components/DataTableTheme/TextLabels';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import PageHeader from '../PageBase/PageHeader';
import {Tooltip, IconButton} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Label from 'src/components/Label';

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
        customBodyRender: customBodySwitchBool
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
        customBodyRender: customBodyTime
      }
    },
    {
      name: "option",
      label: "option",
      options: {
        download: false,
        viewColumns: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          return (
            <Box>
              <Tooltip title="Edit Order" arrow>
                <IconButton
                  sx={{
                    '&:hover': {
                      background: theme.colors.primary.lighter
                    },
                    color: theme.palette.primary.main
                  }}
                  color="inherit"
                  size="small"
                  onClick={
                    () =>{

                    }
                  }
                >
                  <EditTwoToneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Order" arrow>
                <IconButton
                  sx={{
                    '&:hover': { background: theme.colors.error.lighter },
                    color: theme.palette.error.main
                  }}
                  color="inherit"
                  size="small"
                  onClick={
                    () =>{

                    }
                  }
                >
                  <DeleteTwoToneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        }
      }
    },
  ];


  const theme = useTheme();
  const { state } = useAuthStateContext();
  const [tableState, setTableState] = useState(getDataTableState());
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    getData(null);
  }, []);

  function getData(ds: PageManagement | null) {
    userListApi(ds, state)
      .then(res => {
        setTableState({ data: res.data.userList, pageManagement: res.data.pageManagement, isLoading: false });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  const changePage = (ds: MUIDataTableState) => {
    setTableState({ ...tableState, isLoading: true });
    getData(setPageManagement(ds));
  };

  //search submit 
  const onFormSubmit = (formObj, event) => {
    const data = new FormData(event.target);

    var searchData: Search = {
      name: data.get("name").toString(),
      email: data.get("email").toString(),
    }

    var pageManagement: PageManagement = { ...tableState.pageManagement, search: searchData };
    getData(pageManagement);
  };


  let { count, limit, sort, sortColumn } = tableState.pageManagement;
  const options: MUIDataTableOptions = {
    search: false,
    print: false,
    filter: false,
    resizableColumns: true,

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
      <Container maxWidth={false} sx={{ width:1,background: `${theme.colors.alpha.white[100]}` }} >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
          sx={{ pb:2 }}
        >
          <Box component="form" noValidate onSubmit={handleSubmit(onFormSubmit)} sx={{ width: 1,mt:1 }} >
            <Grid
              container
              spacing={1}
              direction="row"
              justifyContent="flex-end"
            >
              <Grid item >
                <TextField
                  id="name"
                  label="name"
                  name="name"
                  autoComplete="name"
                  {...register("name", {})}
                />
              </Grid>
              <Grid item >
                <TextField
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  {...register("email", {})}
                />
              </Grid>
              <Grid item alignItems="stretch" style={{ display: "flex" }}>
                <Button type="submit" variant="contained"> search</Button>
              </Grid>
            </Grid>
          </Box>
          <Grid item xs={12}>
            <DataTableThemeProvider>
              <MUIDataTable
                title={
                  <Typography variant="h4">
                    Sample List
                    {tableState.isLoading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                  </Typography>
                }
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
