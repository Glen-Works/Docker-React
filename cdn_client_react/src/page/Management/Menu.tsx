import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, CircularProgress, Container, Grid, Switch, Typography, useTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableState } from "mui-datatables";
import { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from "react-dom";
import { Helmet } from 'react-helmet-async';
import { useForm } from "react-hook-form";
import { menuAddApi, menuDeleteApi, menuEditApi, menuInfoApi, menuListApi } from 'src/api/Menu/menuApi';
import { ColumnIconButton } from 'src/components/DataTable/CustomerIconRender';
import { CustomBodyTime } from 'src/components/DataTable/CustomerRender';
import DataTableDialog from 'src/components/DataTable/DataTableDialog';
import getDataTableState, { DataTableStatus, PageManagement, Search, setPageManagement } from 'src/components/DataTable/DataTableState';
import DataTableThemeProvider from 'src/components/DataTable/DataTableThemeProvider';
import DialogFormat from 'src/components/DataTable/DialogFormat';
import getTextLabels from 'src/components/DataTable/TextLabels';
import Footer from 'src/components/Footer';
import TextArea from 'src/components/Input/TextArea';
import Label from 'src/components/Label';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import PageHeader from '../PageBase/PageHeader';

interface MapStyle {
  [key: number]: { label: string, color: "primary" | "secondary" | "error" | "black" | "warning" | "success" | "info" }
}

const menuTypeMap: MapStyle = {
  1: { label: '管理者', color: 'primary' },
  2: { label: '一般使用者', color: 'secondary' }
}

const statusMap: MapStyle = {
  0: { label: '停用', color: 'error' },
  1: { label: '啟用', color: 'primary' }
}

interface UserData {
  name: string,
  email: string,
  status: boolean,
  menuType: number,
  remark: string,
}

interface UserAdd extends UserData {
  password: string,
}

function Menu() {

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

  const { register: registerPwd, handleSubmit: handleSubmitPwd, getValues: getPwdValue,
    watch: watchPwd, reset: resetPwd, formState: { errors: pwdErrors } } = useForm(
      {
        defaultValues: {
          password: "",
          passwordCheck: "",
        }
      });

  const { register: registerUser, handleSubmit: handleSubmitUser, setValue: setUserValue, getValues: getUserValue,
    watch: watchUser, reset: resetUser, formState: { errors: menuErrors } } = useForm(
      {
        defaultValues: {
          name: "",
          email: "",
          password: "",
          status: true,
          menuType: 2,
          remark: "",
        }
      });


  useEffect(() => {
    getData(null);
  }, []);

  useEffect(() => { }, [watchUser(), watchPwd()]);

  function getData(ds: PageManagement | null) {
    menuListApi(ds, state)
      .then(res => {
        setTableState({ data: res.data.menuList, pageManagement: res.data.pageManagement, isLoading: false });
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
      getEditDataById(id).then(() => { setAddAndEditOpen(true) });
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
    await menuInfoApi(id, state)
      .then(res => {
        let data = res.data[0];
        setUserValue("name", data.name, { shouldValidate: true });
        setUserValue("email", data.email, { shouldValidate: true });
        setUserValue("status", data.status, { shouldValidate: true });
        setUserValue("menuType", data.menuType, { shouldValidate: true });
        setUserValue("remark", data.remark, { shouldValidate: true });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function getDialogUserData(): UserData {
    var menuData: UserData = {
      name: getUserValue("name"),
      email: getUserValue("email"),
      status: Boolean(Number(getUserValue("status"))),
      menuType: Number(getUserValue("menuType")),
      remark: getUserValue("remark"),
    }
    return menuData;
  }

  const submitAddUser = (formObj, event) => {

    let menuData = getDialogUserData();
    var menuAddData: UserAdd = {
      ...menuData,
      password: getUserValue("password"),
    }
    console.log(menuAddData);
    addUser(menuAddData);
  };

  const submitEditUser = (formObj, event) => {
    let menuData = getDialogUserData();
    console.log(menuData);
    editUser(menuData);
  };

  function addUser(data: any) {
    // console.log(data);
    menuAddApi(data, state)
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
    menuEditApi(selectedId, data, state)
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
    menuDeleteApi(selectedId, state)
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
        customBodyRender: (value, tableMeta, updateValue) => (
          <>
            {(statusMap[value]) &&
              < Label color={statusMap[value].color}>{statusMap[value].label}</Label>
            }
          </>
        )
      }
    },
    {
      name: "menuType",
      label: "menuType",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => (
          <>
            {(menuTypeMap[value] != undefined) &&
              < Label color={menuTypeMap[value].color}>{menuTypeMap[value].label}</Label>
            }
          </>
        )
      }
    },
    {
      name: "loginIp",
      label: "loginIp",
      options: {
        sort: true,
        display: false,
      }
    },
    {
      name: "loginTime",
      label: "loginTime",
      options: {
        sort: true,
        display: false,
        customBodyRender: CustomBodyTime
      }
    },
    {
      name: "createdAt",
      label: "createdAt",
      options: {
        sort: true,
        display: false,
        customBodyRender: CustomBodyTime
      }
    },
    {
      name: "updatedAt",
      label: "updatedAt",
      options: {
        sort: true,
        display: false,
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
        // customHeadLabelRender: CustomHeadLabelLowerCase,
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
      <SuspenseLoader isOpen={tableState.isLoading} />
      <Helmet>
        <title>Menu</title>
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
                  type="search"
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
                  type="search"
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
                    Menu List
                    {tableState.isLoading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                  </Typography>
                }
                data={tableState.data}
                columns={columns}
                options={options}
              />
            </DataTableThemeProvider>

            {/* 修改 */}
            <DataTableDialog
              title={(addAndEditStatus == "add") ? "新增使用者" : "修改使用者"}
              maxWidth="md"
              isOpen={addAndEditOpen}
              handleClose={handleAddAndEditClose}
              submit={handleSubmitUser((addAndEditStatus == "add") ? submitAddUser : submitEditUser, onError)}
            >
              <Grid container justifyContent="center" alignItems="center" direction="column" >
                {(addAndEditStatus == "edit") &&
                  <DialogFormat title="ID :" >
                    <Typography variant="h3" textAlign="left">{selectedId}</Typography>
                  </DialogFormat>
                }
                <DialogFormat title="名稱 :" >
                  <TextField
                    id="name"
                    name="name"
                    defaultValue={getUserValue("name")}
                    {...registerUser("name", {
                      required: "Required field"
                    })}
                    fullWidth={true}
                    error={!!menuErrors?.name}
                    helperText={menuErrors?.name ? menuErrors.name.message : null}
                  />
                </DialogFormat>

                <DialogFormat title="信箱 :" >
                  <TextField
                    id="email"
                    //label="Email Address"
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
                    error={!!menuErrors?.email}
                    helperText={menuErrors?.email ? menuErrors.email.message : null}
                  />
                </DialogFormat>
                {(addAndEditStatus == "add") &&
                  <DialogFormat title="密碼 :" >
                    <TextField
                      id="password"
                      name="password"
                      type="password"
                      {...registerUser("password", {
                        required: "Required field",
                        minLength: { value: 5, message: "at least 5 letter" },
                        maxLength: { value: 100, message: "need less 100 length" },
                      })}
                      fullWidth={true}
                      error={!!menuErrors?.password}
                      helperText={menuErrors?.password ? menuErrors.password.message : null}
                    />
                  </DialogFormat>
                }
                <DialogFormat title="狀態 :" >
                  <Switch
                    id="status"
                    name="status"
                    checked={Boolean(Number(getUserValue("status")))}
                    {...registerUser("status", {
                    })}
                  />
                </DialogFormat>
                <DialogFormat title="身份 :" >
                  <TextField
                    id="menuType"
                    name="menuType"
                    select
                    SelectProps={{
                      native: true,
                    }}
                    defaultValue={getUserValue("menuType")}
                    {...registerUser("menuType", {
                      required: "Required field"
                    })}
                    fullWidth={true}
                    error={!!menuErrors?.menuType}
                    helperText={menuErrors?.menuType ? menuErrors.menuType.message : null}
                  >
                    {Object.keys(menuTypeMap).map((value) => (
                      <option key={value} value={value}>
                        {menuTypeMap[value].label}
                      </option>
                    ))
                    }
                  </TextField>
                </DialogFormat>
                <DialogFormat title="備註 :" >
                  <TextArea
                    minRows={5}
                    maxRows={8}
                    id="remark"
                    name="remark"
                    defaultValue={getUserValue("remark")}
                    {...registerUser("remark", {})}
                  />
                </DialogFormat>
              </Grid>
            </DataTableDialog>

            {/* 刪除 */}
            <DataTableDialog
              title={"刪除使用者"}
              maxWidth="xs"
              isOpen={deleteOpen}
              handleClose={handleDeleteClose}
              submit={deleteUser}
            >
              <Box component="span" sx={{ typography: "h4" }}>
                {"是否確定要刪除" + selectedData}
              </Box>

            </DataTableDialog >
          </Grid >
        </Grid >
      </Container >
      <Footer />
    </>
  );
}

export default Menu;
