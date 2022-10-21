import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogTitle, Grid, Typography, useTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableState } from "mui-datatables";
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from "react-hook-form";
import { userListApi } from 'src/api/Sample/sampleDataTableApi';
import { ColumnIconButton } from 'src/components/DataTableTheme/CustomerIconRender';
import { CustomBodySwitchBool, CustomBodyTime } from 'src/components/DataTableTheme/CustomerRender';
import getDataTableState, { DataTableStatus, PageManagement, Search, setPageManagement } from 'src/components/DataTableTheme/DataTableState';
import DataTableThemeProvider from 'src/components/DataTableTheme/DataTableThemeProvider';
import getTextLabels from 'src/components/DataTableTheme/TextLabels';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import PageHeader from '../PageBase/PageHeader';

function SampleDataTable() {

  const theme = useTheme();
  const { state } = useAuthStateContext();
  const [tableState, setTableState] = useState<DataTableStatus>(getDataTableState());
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEditClickOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteClickOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };


  useEffect(() => {
    getData(null);
  }, []);

  function setDelete(id: number) {
    console.log(id);
    // userDeleteApi(id, state)
    //   .then(res => {
    // getData({ ...tableState.pageManagement });
    // handleDeleteClose();
    //   })
    //   .catch(error => {
    //     console.log("error:" + error.response?.data?.msg);
    //   });
  }


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
        customBodyRender: CustomBodySwitchBool
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
        customBodyRender: CustomBodyTime
      }
    },
    {
      name: "createdAt",
      label: "createdAt",
      options: {
        sort: true,
        customBodyRender: CustomBodyTime
      }
    },
    {
      name: "updatedAt",
      label: "updatedAt",
      options: {
        sort: true,
        customBodyRender: CustomBodyTime
      }
    },
    {
      name: "option",
      label: "option",
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex: number, rowIndex: number) => {
          console.log(dataIndex, rowIndex);
          let id = tableState.data[dataIndex].id ?? 0;
          return (
            <Box>
              {/* <ColumnTooltip title="修改"> */}
              <ColumnIconButton
                title="修改"
                handleClickOpen={() => { handleEditClickOpen() }}
                color={theme.palette.primary.main}
              >
                <EditTwoToneIcon fontSize="small" />
              </ColumnIconButton>
              {/* </ColumnTooltip> */}
              {/* <SampleDataTableUserInfo /> */}

              {/* <ColumnTooltip title="刪除"> */}
              <ColumnIconButton
                title="刪除"
                handleClickOpen={handleDeleteClickOpen}
                color={theme.palette.error.main}
              >
                <DeleteTwoToneIcon fontSize="small" />
              </ColumnIconButton>
              {/* </ColumnTooltip> */}
              <Dialog open={deleteOpen} onClose={handleDeleteClose}>
                <DialogTitle>刪除使用者</DialogTitle>
                <DialogActions>
                  <Button onClick={handleDeleteClose}>取消</Button>
                  <Button onClick={() => { console.log(dataIndex) }}>確定</Button>
                </DialogActions>
              </Dialog>
              <Button onClick={() => { setDelete(dataIndex) }}>確定</Button>
            </Box>
          );
        }
      }
    },
  ];


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
      <Container maxWidth={false} sx={{ background: `${theme.colors.alpha.white[100]}` }} >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Box component="form" noValidate onSubmit={handleSubmit(onFormSubmit)} sx={{ width: 1 }} >
            <Grid
              // xs={12}
              container
              spacing={2}
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item >
                <TextField
                  id="name"
                  label="name"
                  name="name"
                  autoComplete="name"
                  margin="normal"
                  autoFocus
                  {...register("name", {})}
                />
              </Grid>
              <Grid item >
                <TextField
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  margin="normal"

                  autoFocus
                  {...register("email", {})}
                />
              </Grid>
              <Grid item >
                <Button
                  sx={{ width: '70px' }}
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  search
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Grid item xs={12}>
            <DataTableThemeProvider>
              <MUIDataTable
                title={
                  <Typography variant="h6">
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
