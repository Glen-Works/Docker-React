import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, CircularProgress, Container, Grid, Switch, TextareaAutosize, Typography, useTheme } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableState } from "mui-datatables";
import { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from "react-dom";
import { Helmet } from 'react-helmet-async';
import { useForm } from "react-hook-form";
import { userAddApi, userDeleteApi, userEditApi, userInfoApi, userListApi } from 'src/api/Sample/sampleDataTableApi';
import { ColumnIconButton } from 'src/components/DataTable/CustomerIconRender';
import { CustomBodySwitchBool, CustomBodyTime } from 'src/components/DataTable/CustomerRender';
import DataTableDailog from 'src/components/DataTable/DataTableDailog';
import getDataTableState, { DataTableStatus, PageManagement, Search, setPageManagement } from 'src/components/DataTable/DataTableState';
import DataTableThemeProvider from 'src/components/DataTable/DataTableThemeProvider';
import getTextLabels from 'src/components/DataTable/TextLabels';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import PageHeader from '../PageBase/PageHeader';

interface UserData {
  name: string,
  email: string,
  status: boolean,
  userType: number,
  remark: string,
}

interface UserAdd extends UserData {
  password: string,
}

function SampleDataTable() {

  const theme = useTheme();
  const { state } = useAuthStateContext();
  const [tableState, setTableState] = useState<DataTableStatus>(getDataTableState());
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedData, setSelectedData] = useState<string>("");
  const [addAndEditStatus, setAddAndEditStatus] = useState<"edit" | "add" | "">("");
  const [addAndEditOpen, setAddAndEditOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const onError = (errors, e) => console.log(errors, e);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser, handleSubmit: handleSubmitUser, setValue: setUserValue, getValues: getUserValue,
    watch: watchUser, reset: resetUser, formState: { errors: userErrors } } = useForm(
      {
        defaultValues: {
          name: "",
          email: "",
          password: "",
          status: true,
          userType: 2,
          remark: "",
        }
      });


  useEffect(() => {
    getData(null);
  }, []);

  useEffect(() => {
    // console.log(
    //   getUserValue("name") + "," +
    //   getUserValue("email") + "," +
    //   getUserValue("status") + "," +
    //   getUserValue("userType") + "," +
    //   getUserValue("remark") + "," +
    //   getUserValue("password") + ","
    // );
  }, [watchUser()]);

  function getData(ds: PageManagement | null) {
    userListApi(ds, state)
      .then(res => {
        setTableState({ data: res.data.userList, pageManagement: res.data.pageManagement, isLoading: false });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  const handleAddClickOpen = () => {
    unstable_batchedUpdates(() => {
      setAddAndEditStatus("add");
      setAddAndEditOpen(true);
      resetUser();
    });
  };

  const handleEditClickOpen = (id: number) => {
    unstable_batchedUpdates(() => {
      setAddAndEditStatus("edit");
      getEditDataById(id).then(async () => { setAddAndEditOpen(true) });
      setSelectedId(id);
    });
  };

  const handleAddAndEditClose = () => {
    unstable_batchedUpdates(() => {
      setAddAndEditOpen(false);
      resetUser();
    });
  };

  const handleDeleteClickOpen = (id: number, data: string) => {
    unstable_batchedUpdates(() => {
      setDeleteOpen(true);
      setSelectedId(id);
      setSelectedData(data);
    });
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  async function getEditDataById(id: number) {
    await userInfoApi(id, state)
      .then(res => {
        let data = res.data[0];
        setUserValue("name", data.name, { shouldValidate: true });
        setUserValue("email", data.email, { shouldValidate: true });
        setUserValue("status", data.status, { shouldValidate: true });
        setUserValue("userType", data.userType, { shouldValidate: true });
        setUserValue("remark", data.remark, { shouldValidate: true });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function getDialogUserData(): UserData {
    var userData: UserData = {
      name: getUserValue("name"),
      email: getUserValue("email"),
      status: Boolean(Number(getUserValue("status"))),
      userType: Number(getUserValue("userType")),
      remark: getUserValue("remark"),
    }
    return userData;
  }

  const checkAddUser = (formObj, event) => {

    let userData = getDialogUserData();
    var userAddData: UserAdd = {
      ...userData,
      password: getUserValue("password"),
    }
    console.log(userAddData);
    addUser(userAddData);
  };

  const checkEditUser = (formObj, event) => {

    let userData = getDialogUserData();
    console.log(userData);
    editUser(userData);
  };

  function addUser(data: any) {
    // console.log(data);
    userAddApi(data, state)
      .then(res => {
        handleAddAndEditClose();
        getData({ ...tableState.pageManagement });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function editUser(data: any) {
    // console.log(data);
    userEditApi(selectedId, data, state)
      .then(res => {
        handleAddAndEditClose();
        getData({ ...tableState.pageManagement });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function deleteUser() {
    // console.log(selectedIndex);
    userDeleteApi(selectedId, state)
      .then(res => {
        handleDeleteClose();
        getData({ ...tableState.pageManagement });
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
        // console.log('action not handled.');
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
              alignItems="stretch"
            >
              <Grid item >
                <TextField
                  id="name"
                  label="name"
                  name="name"
                  autoComplete="name"
                  size="small"
                  {...register("name", {})}
                />
              </Grid>
              <Grid item >
                <TextField
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  size="small"
                  {...register("email", {})}
                />
              </Grid>
              <Grid item  >
                <Button
                  type="submit"
                  color='success'
                  variant="contained"
                  startIcon={<SearchIcon fontSize="small" />}
                >
                  Search</Button>
              </Grid>
              <Grid item >
                <Button
                  variant="contained"
                  color='warning'
                  startIcon={<AddTwoToneIcon fontSize="small" />}
                  onClick={handleAddClickOpen}
                >
                  Create
                </Button>
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
            <DataTableDailog
              title={(addAndEditStatus == "add") ? "新增使用者" : "修改使用者"}
              maxWidth="md"
              isOpen={addAndEditOpen}
              handleClose={handleAddAndEditClose}
              submit={handleSubmitUser((addAndEditStatus == "add") ? checkAddUser : checkEditUser, onError)}
            >
              {/* onSubmit={handleSubmitUser(checkEditUser)} */}
              <Box component="form" noValidate sx={{ width: 1, height: 1, mt: 1, justifyContent: 'center', display: 'flex' }} >
                <Grid container xs={11} rowSpacing={2} columnSpacing={{ xs: 1 }} sx={{ justifyContent: "center" }}>
                  <Grid item xs={12} alignItems="center" display="flex">
                    <Grid>
                      <InputLabel sx={{ typography: "h4", mr: 1 }}>ID :</InputLabel>
                    </Grid>
                    <Grid xs={12}>
                      <InputLabel sx={{ typography: "h4", mr: 1 }}>{selectedId}</InputLabel>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} alignItems="center" display="flex">
                    <Grid>
                      <InputLabel sx={{ typography: "h4", mr: 1 }}>名稱 :</InputLabel>
                    </Grid>
                    <Grid xs={12}>
                      <TextField
                        id="name"
                        label="Name"
                        name="name"
                        defaultValue={getUserValue("name")}
                        {...registerUser("name", {
                          required: "Required field"
                        })}
                        fullWidth={true}
                        error={!!userErrors?.name}
                        helperText={userErrors?.name ? userErrors.name.message : null}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} alignItems="center" display="flex">
                    <Grid>
                      <InputLabel sx={{ typography: "h4", mr: 1 }}>信箱 :</InputLabel>
                    </Grid>
                    <Grid xs={12}>
                      <TextField
                        id="email"
                        label="Email Address"
                        name="email"
                        defaultValue={getUserValue("status")}
                        {...registerUser("email", {
                          required: "Required field",
                          minLength: { value: 5, message: "at least 5 letter" },
                          maxLength: { value: 100, message: "need less 100 length" },
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9._]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          }
                        })}
                        fullWidth={true}
                        error={!!userErrors?.email}
                        helperText={userErrors?.email ? userErrors.email.message : null}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} alignItems="center" display="flex">
                    <Grid>
                      <InputLabel sx={{ typography: "h4", mr: 1 }}>狀態 :</InputLabel>
                    </Grid>
                    <Grid xs={12}>
                      <Switch
                        id="status"
                        name="status"
                        //checked={Boolean(Number(getUserValue("status")))}
                        {...registerUser("status", {
                          required: "Required field"
                        })}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} alignItems="center" display="flex">
                    <Grid>
                      <InputLabel sx={{ typography: "h4", mr: 1 }}>管理者 :</InputLabel>
                    </Grid>
                    <Grid xs={12}>
                      <Switch
                        id="userType"
                        name="userType"
                        //checked={Boolean(Number(getUserValue("userType")))}
                        {...registerUser("userType", {
                          required: "Required field"
                        })}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} alignItems="flex-start" display="flex">
                    <Grid>
                      <InputLabel sx={{ typography: "h4", mr: 1 }}>備註 :</InputLabel>
                    </Grid>
                    <Grid xs={12}>
                      <TextareaAutosize
                        aria-label="minimum height"
                        style={{
                          width: '100%',
                          border: '1px solid rgba(0, 0, 0, 0.23)',
                          borderRadius: '10px',
                          margin: 0,
                          padding: '16px 14px',
                          fontSize: '14px',
                          fontFamily: '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                          fontWeight: 400,
                          lineHeight: '1.4375em',
                        }}
                        minRows={5}
                        maxRows={8}
                        id="remark"
                        name="remark"
                        defaultValue={getUserValue("remark")}
                        {...registerUser("remark", {})}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* <Grid
                  container
                  display="flex"
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="center"
                >

                  {(addAndEditStatus == "edit") &&
                    <Grid
                      container
                      spacing={1}
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Grid item xs={4} >
                        <Typography variant="h2" sx={{ pb: 1 }}>
                          ID：
                        </Typography>
                      </Grid>
                      <Grid item xs={8} >
                        <Typography variant="h2" sx={{ pb: 1 }}>
                          {selectedId}
                        </Typography>
                      </Grid>
                    </Grid>
                  }

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
                        label="Name"
                        name="name"
                        // autoComplete="name"
                        {...registerUser("name", {
                          required: "Required field"
                        })}
                        defaultValue={getUserValue("name")}
                        fullWidth={true}
                        error={!!userErrors?.name}
                        helperText={userErrors?.name ? userErrors.name.message : null}
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
                        id="email"
                        label="Email Address"
                        name="email"
                        // autoComplete="email"
                        {...registerUser("email", {
                          required: "Required field",
                          minLength: { value: 5, message: "at least 5 letter" },
                          maxLength: { value: 100, message: "need less 100 length" },
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9._]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          }
                        })}
                        defaultValue={getUserValue("status")}
                        fullWidth={true}
                        error={!!userErrors?.email}
                        helperText={userErrors?.email ? userErrors.email.message : null}
                      />
                    </Grid>
                  </Grid>

                  {(addAndEditStatus == "add") &&
                    <Grid
                      container
                      spacing={1}
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Grid item xs={4} >
                        <Typography variant="h2" sx={{ pb: 1 }}>
                          密碼：
                        </Typography>
                      </Grid>
                      <Grid item xs={8} >
                        <TextField
                          id="password"
                          label="Password"
                          name="password"
                          type="password"
                          // autoComplete="password"
                          {...registerUser("password", {
                            required: "Required field",
                            minLength: { value: 5, message: "at least 5 letter" },
                            maxLength: { value: 100, message: "need less 100 length" },
                          })}
                          fullWidth={true}
                          error={!!userErrors?.password}
                          helperText={userErrors?.password ? userErrors.password.message : null}
                        />
                      </Grid>
                    </Grid>
                  }

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
                      <Switch
                        id="status"
                        name="status"
                        checked={Boolean(Number(getUserValue("status")))}
                        {...registerUser("status", {})}
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
                        使用者區分：
                      </Typography>
                    </Grid>
                    <Grid item xs={8} >
                      <Select
                        labelId="demo-select-small"
                        label=""
                        size="small"
                        id="userType"
                        name="userType"
                        value={Number(getUserValue("userType"))}
                        {...registerUser("userType", {
                          required: "Required field",
                        })}
                      >
                        <MenuItem value={1}>管理者</MenuItem>
                        <MenuItem value={2}>一般使用者</MenuItem>
                      </Select>
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
                        備註：
                      </Typography>
                    </Grid>
                    <Grid item xs={8} >
                      <TextareaAutosize
                        minRows={3}
                        id="remark"
                        name="remark"
                        {...registerUser("remark", {})}
                        defaultValue={getUserValue("remark")}
                      />
                    </Grid>
                  </Grid>
                </Grid> */}
              </Box>
            </DataTableDailog>

            {/* 刪除 */}
            <DataTableDailog
              title={"刪除使用者"}
              maxWidth="xs"
              isOpen={deleteOpen}
              handleClose={handleDeleteClose}
              submit={deleteUser}
            >
              <Box component="span" sx={{ typography: "h4" }}>
                {"是否確定要刪除" + selectedData}
              </Box>

            </DataTableDailog >
          </Grid >
        </Grid >
      </Container >
      <Footer />
    </>
  );
}

export default SampleDataTable;
