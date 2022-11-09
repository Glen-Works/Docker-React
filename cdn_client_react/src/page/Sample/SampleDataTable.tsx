import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { Box, Button, CircularProgress, Container, Grid, Typography, useTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableState } from "mui-datatables";
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from "react-hook-form";
import { userDeleteApi, userEditApi, userInfoApi, userListApi } from 'src/api/Sample/sampleDataTableApi';
import { ColumnIconButton } from 'src/components/DataTableTheme/CustomerIconRender';
import { CustomBodySwitchBool, CustomBodyTime } from 'src/components/DataTableTheme/CustomerRender';
import getDataTableState, { DataTableStatus, PageManagement, Search, setPageManagement } from 'src/components/DataTableTheme/DataTableState';
import DataTableThemeProvider from 'src/components/DataTableTheme/DataTableThemeProvider';
import getTextLabels from 'src/components/DataTableTheme/TextLabels';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import PageHeader from '../PageBase/PageHeader';
import SampleDataTableDailog from './SampleDataTableDailog';

interface UserData {
  name: string,
  email: string,
  status: boolean,
  userType: boolean,
  remark: string,
}

function SampleDataTable() {

  const theme = useTheme();
  const { state } = useAuthStateContext();
  const [tableState, setTableState] = useState<DataTableStatus>(getDataTableState());
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedData, setSelectedData] = useState<string>("");
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [userDataState, setUserDataState] = useState<UserData>();

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

  const handleEditClickOpen = (id: number) => {
    setEditOpen(true);
    getEditDataById(id);
    setSelectedIndex(id);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteClickOpen =
    (id: number, data: string) => {
      setDeleteOpen(true);
      setSelectedIndex(id);
      setSelectedData(data);
    };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };


  function getEditDataById(id: number) {
    userInfoApi(id, state)
      .then(res => {
        let data = res.data[0];
        if (data == null || data == undefined) {
          console.log("error:" + "無此使用者");
        }
        setUserDataState({
          name: data[0].name,
          email: data[0].email,
          status: data[0].status,
          userType: data[0].userType,
          remark: data[0].remark,
        });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function EditUser() {
    console.log(selectedIndex);
    console.log(userDataState);

    // userEditApi(selectedIndex, data, state)
    userEditApi(selectedIndex, null, state)
      .then(res => {
        // getData({ ...tableState.pageManagement });
        handleEditClose();
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function deleteUser() {
    console.log(selectedIndex);
    userDeleteApi(selectedIndex, state)
      .then(res => {
        getData({ ...tableState.pageManagement });
        handleDeleteClose();
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
        download: false,
        viewColumns: false,
        sort: false,
        customBodyRenderLite: (dataIndex: number, rowIndex: number) => {
          // console.log(dataIndex, rowIndex);
          let rowData = tableState.data[dataIndex];
          let id = rowData.id;
          let data = `id:${rowData.id},email:${rowData.email}`;
          return (
            <Box sx={{ display: 'inline-flex' }}>
              <ColumnIconButton
                title="修改"
                handleClickOpen={() => { handleEditClickOpen(id) }}
                color={theme.palette.primary.main}
                background={theme.colors.primary.lighter}
              >
                <EditTwoToneIcon fontSize="small" />
              </ColumnIconButton>
              <ColumnIconButton
                title="刪除"
                handleClickOpen={() => handleDeleteClickOpen(id, data)}
                color={theme.palette.error.main}
                background={theme.colors.error.lighter}
              >
                <DeleteTwoToneIcon fontSize="small" />
              </ColumnIconButton>
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
      <Container maxWidth={false}
        sx={{
          width: 1,
          background: `${theme.colors.alpha.white[100]}`,
          minHeight: 'calc(100vh - 200px)',
          pb: '50px'
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={1}
        >
          <Box component="form" noValidate onSubmit={handleSubmit(onFormSubmit)} sx={{ width: 1, mt: 1 }} >
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

            {/* 修改 */}
            <SampleDataTableDailog
              title={"修改使用者"}
              isOpen={editOpen}
              handleClose={handleEditClose}
              submit={EditUser}
            >
              <Box component="form" noValidate sx={{ width: 1, height: 1, mt: 1 }} >
                <Grid
                  container
                  display="flex"
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={4} >
                      <Typography variant="h2" sx={{ pb: 1 }}>
                        名稱：
                      </Typography>
                    </Grid>
                    <Grid item xs={8} >
                      <TextField
                        id="name"
                        label="name"
                        name="name"
                        autoComplete="name"
                        {...register("name", {})}
                        fullWidth={true}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={4} >
                      <Typography variant="h2" sx={{ pb: 1 }}>
                        信箱：
                      </Typography>
                    </Grid>
                    <Grid item xs={8} >
                      <TextField
                        id="name"
                        label="name"
                        name="name"
                        autoComplete="name"
                        {...register("name", {})}
                        fullWidth={true}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={4} >
                      <Typography variant="h2" sx={{ pb: 1 }}>
                        狀態：
                      </Typography>
                    </Grid>
                    <Grid item xs={8} >
                      <TextField
                        id="name"
                        label="name"
                        name="name"
                        autoComplete="name"
                        {...register("name", {})}
                        fullWidth={true}
                      />
                    </Grid>
                  </Grid>       <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={4} >
                      <Typography variant="h2" sx={{ pb: 1 }}>
                        管理者：
                      </Typography>
                    </Grid>
                    <Grid item xs={8} >
                      <TextField
                        id="name"
                        label="name"
                        name="name"
                        autoComplete="name"
                        {...register("name", {})}
                        fullWidth={true}
                      />
                    </Grid>
                  </Grid>       <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={4} >
                      <Typography variant="h2" sx={{ pb: 1 }}>
                        備註：
                      </Typography>
                    </Grid>
                    <Grid item xs={8} >
                      <TextField
                        id="name"
                        label="name"
                        name="name"
                        autoComplete="name"
                        {...register("name", {})}
                        fullWidth={true}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </SampleDataTableDailog>

            {/* 刪除 */}
            <SampleDataTableDailog
              title={"刪除使用者"}
              content={"是否確定要刪除"}
              isOpen={deleteOpen}
              data={selectedData}
              handleClose={handleDeleteClose}
              submit={deleteUser}
            />
          </Grid >
        </Grid >
      </Container >
      <Footer />
    </>
  );
}

export default SampleDataTable;
