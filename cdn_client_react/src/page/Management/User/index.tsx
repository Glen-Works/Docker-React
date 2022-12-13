import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import KeyTwoToneIcon from '@mui/icons-material/KeyTwoTone';
import { Box, CircularProgress, Container, Grid, Typography, useTheme } from '@mui/material';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableState } from "mui-datatables";
import { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from "react-dom";
import { Helmet } from 'react-helmet-async';
import { useForm } from "react-hook-form";
import { roleAllListApi, userAddApi, userDeleteApi, userDeleteMultipleApi, userEditApi, userInfoApi, userListApi, userPwdEditApi } from 'src/api/User/userApi';
import { ColumnIconButton } from 'src/components/DataTable/CustomerIconRender';
import { CustomBodyTime } from 'src/components/DataTable/CustomerRender';
import DataTableDialog from 'src/components/DataTable/DataTableDialog';
import getDataTableState, { DataTableStatus, PageManagement, Search, setPageManagement } from 'src/components/DataTable/DataTableState';
import DataTableThemeProvider from 'src/components/DataTable/DataTableThemeProvider';
import getTextLabels from 'src/components/DataTable/TextLabels';
import Footer from 'src/components/Footer';
import Label from 'src/components/Label';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import { useAuthMenuContext } from 'src/contexts/AuthMenuContext';
import { validAuthMenuFeature } from 'src/middleware/authMenuMiddleware';
import UserAddAndEditDialog from './UserAddAndEditDialog';
import UserEditPasswordDialog from './UserEditPasswordDialog';
import UserSearch from './UserSearch';


export interface MapStyle {
  [key: number]: { label: string, color: "primary" | "secondary" | "error" | "black" | "warning" | "success" | "info" }
}

const userTypeMap: MapStyle = {
  1: { label: '管理者', color: 'primary' },
  2: { label: '一般使用者', color: 'secondary' }
}

const statusMap: MapStyle = {
  0: { label: '停用', color: 'error' },
  1: { label: '啟用', color: 'primary' }
}

export interface RoleListSelect {
  id: number,
  name: string,
  key: string,
  status: boolean,
}

interface UserData {
  name: string,
  email: string,
  status: boolean,
  userType: number,
  remark: string,
  roleUser: number[],
}

interface UserWithPassword extends UserData {
  password: string,
}

interface UserPassword {
  newPassword: string,
  checkPassword: string,
}

function User() {

  const theme = useTheme();
  const { state } = useAuthStateContext();
  const [tableState, setTableState] = useState<DataTableStatus>(getDataTableState());
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedData, setSelectedData] = useState<string>("");
  const [addAndEditStatus, setAddAndEditStatus] = useState<"edit" | "add" | "">("");
  const [addAndEditOpen, setAddAndEditOpen] = useState<boolean>(false);
  const [editPasswordOpen, setEditPwdOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const AuthMenu = useAuthMenuContext();

  const [checkFeatureList, setCheckFeatureList] = useState<boolean>(false);
  const [checkFeatureCreate, setCheckFeatureCreate] = useState<boolean>(false);
  const [checkFeatureUpdate, setCheckFeatureUpdate] = useState<boolean>(false);
  const [checkFeatureDelete, setCheckFeatureDelete] = useState<boolean>(false);
  const [checkFeaturePassword, setCheckFeaturePassword] = useState<boolean>(false);

  const [roleListSelect, setRoleListSelect] = useState<RoleListSelect[]>([]);
  const [roleCheckBoxSelected, setRoleCheckBoxSelected] = useState<number[]>([]);

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
    unstable_batchedUpdates(() => {
      setCheckFeatureList(validAuthMenuFeature(AuthMenu.state, "user_list"));   //權限 列表
      setCheckFeatureCreate(validAuthMenuFeature(AuthMenu.state, "user_create")); //權限 新增
      setCheckFeatureUpdate(validAuthMenuFeature(AuthMenu.state, "user_update")); //權限 修改
      setCheckFeatureDelete(validAuthMenuFeature(AuthMenu.state, "user_delete")); //權限 刪除
      setCheckFeaturePassword(validAuthMenuFeature(AuthMenu.state, "user_password_update")); //權限 密碼修改
    });

  }, []);

  useEffect(() => { }, [watchUser(), watchPwd()]);

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
    getRoleAllList().then(() => {
      unstable_batchedUpdates(() => {
        setRoleCheckBoxSelected([]);
        setAddAndEditStatus("add");
        setAddAndEditOpen(true);
        resetUser();
      });
    });
  };

  const handleEditClickOpen = async (id: number) => {
    await Promise.all([getRoleAllList(), getEditDataById(id)]).then(() => {
      unstable_batchedUpdates(() => {
        setAddAndEditStatus("edit");
        setAddAndEditOpen(true);
        setSelectedId(id);
      });
    });
  };

  const handlePwdClickOpen = (id: number) => {
    unstable_batchedUpdates(() => {
      setEditPwdOpen(true);
      setSelectedId(id);
    });
  };

  const handleEditPwdClose = () => {
    setEditPwdOpen(false);
    resetPwd();
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

  async function getRoleAllList() {
    await roleAllListApi(null, state)
      .then(res => {
        setRoleListSelect(res.data.roleList);
      }).catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  async function getEditDataById(id: number) {
    await userInfoApi(id, state)
      .then(res => {
        let data = res.data.userInfo;
        let roleUser = res.data.roleUser;
        setRoleCheckBoxSelected(roleUser ?? []);
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
      roleUser: roleCheckBoxSelected,
    }
    return userData;
  }

  const submitEditPwd = (formObj, event) => {
    var userPwd: UserPassword = {
      newPassword: getPwdValue("password"),
      checkPassword: getPwdValue("password"),
    }

    console.log(userPwd);
    editUserPwd(userPwd);
  };

  const submitAddUser = (formObj, event) => {

    let userData = getDialogUserData();
    var userAddData: UserWithPassword = {
      ...userData,
      password: getUserValue("password"),
    }
    console.log(userAddData);
    addUser(userAddData);
  };

  const submitEditUser = (formObj, event) => {
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

  function editUserPwd(data: any) {
    // console.log(data);
    userPwdEditApi(selectedId, data, state)
      .then(res => {
        handleEditPwdClose();
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

  function deleteMultipleUser(ids: number[]) {
    userDeleteMultipleApi({ id: ids }, state)
      .then(res => {
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

  const onMultipleDelete = (rowsDeleted: {
    lookup: { [dataIndex: number]: boolean };
    data: Array<{ index: number; dataIndex: number }>;
  },
    newTableData: any[],
  ) => {
    let deleteIds: number[] = rowsDeleted.data.map((item) => {
      return tableState.data[item.dataIndex].id;
    });
    deleteMultipleUser(deleteIds);
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
      label: "名稱",
      options: {
        sort: true,
      }
    },
    {
      name: "email",
      label: "信箱",
      options: {
        sort: true,
      }
    },
    {
      name: "status",
      label: "狀態",
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
      name: "userType",
      label: "角色",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => (
          <>
            {(userTypeMap[value] != undefined) &&
              < Label color={userTypeMap[value].color}>{userTypeMap[value].label}</Label>
            }
          </>
        )
      }
    },
    {
      name: "loginIp",
      label: "登入IP",
      options: {
        sort: true,
        display: false,
      }
    },
    {
      name: "loginTime",
      label: "登入時間",
      options: {
        sort: true,
        display: false,
        customBodyRender: CustomBodyTime
      }
    },
    {
      name: "createdAt",
      label: "創建日期",
      options: {
        sort: true,
        display: false,
        customBodyRender: CustomBodyTime
      }
    },
    {
      name: "updatedAt",
      label: "修改日期",
      options: {
        sort: true,
        display: false,
        customBodyRender: CustomBodyTime
      }
    },
    {
      name: "option",
      label: " ",
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
              {
                (checkFeatureUpdate) &&
                <ColumnIconButton
                  title="修改"
                  handleClickOpen={() => { handleEditClickOpen(id) }}
                  color={theme.palette.primary.main}
                  background={theme.colors.primary.lighter}
                >
                  <EditTwoToneIcon fontSize="small" />
                </ColumnIconButton>
              }
              {
                (checkFeatureDelete) &&
                <ColumnIconButton
                  title="刪除"
                  handleClickOpen={() => handleDeleteClickOpen(id, data)}
                  color={theme.palette.error.main}
                  background={theme.colors.error.lighter}
                >
                  <DeleteTwoToneIcon fontSize="small" />
                </ColumnIconButton>
              }
              {
                (checkFeaturePassword) &&
                <ColumnIconButton
                  title="修改密碼"
                  handleClickOpen={() => { handlePwdClickOpen(id) }}
                  color={theme.palette.info.main}
                  background={theme.colors.error.lighter}
                >
                  <KeyTwoToneIcon fontSize="small" />
                </ColumnIconButton>
              }
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

    onRowsDelete: onMultipleDelete,
    onTableChange: (action, tableState) => {
      // console.log(action, tableState);
      switch (action) {
        case 'changePage':
          changePage(tableState);
          break;
        case 'sort':
          changePage(tableState);
          break;
        case 'changeRowsPerPage':
          changePage(tableState);
          break;
        // default:
        //   console.log('action name:' + action);
        //   console.log(tableState);
      }
    },
  };

  return (
    <>
      <SuspenseLoader isOpen={tableState.isLoading} />
      <Helmet>
        <title>Transactions - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          title={"使用者"}
          subTitle={""}
        />
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
          <UserSearch
            checkFeatureCreate={checkFeatureCreate}
            register={register}
            handleSubmit={handleSubmit}
            onFormSubmit={onFormSubmit}
            handleAddClickOpen={handleAddClickOpen}
          />

          <Grid item xs={12}>
            <DataTableThemeProvider>
              {
                (checkFeatureList) &&
                <MUIDataTable
                  title={
                    <Typography variant="h4">
                      User List
                      {tableState.isLoading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>
                  }
                  data={tableState.data}
                  columns={columns}
                  options={options}
                />
              }
            </DataTableThemeProvider>

            <UserAddAndEditDialog
              selectedId={selectedId}
              roleListSelect={roleListSelect}
              roleCheckBoxSelected={roleCheckBoxSelected}
              setRoleCheckBoxSelected={setRoleCheckBoxSelected}
              addAndEditStatus={addAndEditStatus}
              addAndEditOpen={addAndEditOpen}
              userTypeMap={userTypeMap}
              handleAddAndEditClose={handleAddAndEditClose}
              submitAddUser={submitAddUser}
              submitEditUser={submitEditUser}
              onError={onError}
              registerUser={registerUser}
              handleSubmitUser={handleSubmitUser}
              getUserValue={getUserValue}
              userErrors={userErrors}
            />

            <UserEditPasswordDialog
              selectedId={selectedId}
              editPasswordOpen={editPasswordOpen}
              handleEditPwdClose={handleEditPwdClose}
              submitEditPwd={submitEditPwd}
              onError={onError}
              registerPwd={registerPwd}
              handleSubmitPwd={handleSubmitPwd}
              watchPwd={watchPwd}
              pwdErrors={pwdErrors}
            />

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

export default User;
