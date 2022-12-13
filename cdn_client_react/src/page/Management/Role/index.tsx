import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { Box, CircularProgress, Container, Grid, Typography, useTheme } from '@mui/material';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableState } from "mui-datatables";
import { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from "react-dom";
import { Helmet } from 'react-helmet-async';
import { useForm } from "react-hook-form";
import { menuAllListApi, roleAddApi, roleDeleteApi, roleDeleteMultipleApi, roleEditApi, roleInfoApi, roleListApi } from 'src/api/Role/roleApi';
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
import { MenuTree, validAuthMenuFeature } from 'src/middleware/authMenuMiddleware';
import { makeRecursionTree } from 'src/utils/baseFunction';
import RoleAddAndEditDialog from './RoleAddAndEditDialog';
import RoleSearch from './RoleSearch';


interface MapStyle {
  [key: number]: { label: string, color: "primary" | "secondary" | "error" | "black" | "warning" | "success" | "info" }
}

const statusMap: MapStyle = {
  0: { label: '停用', color: 'error' },
  1: { label: '啟用', color: 'primary' }
}

interface RoleData {
  name: string,
  key: string,
  status: boolean,
  weight: number,
  remark: string,
  roleMenu: number[],
}

function Role() {

  const theme = useTheme();
  const AuthMenu = useAuthMenuContext();
  const { state } = useAuthStateContext();
  const [menuCheckboxList, setMenuCheckboxList] = useState<MenuTree>(null);
  const [tableState, setTableState] = useState<DataTableStatus>(getDataTableState());
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedData, setSelectedData] = useState<string>("");
  const [addAndEditStatus, setAddAndEditStatus] = useState<"edit" | "add" | "">("");
  const [addAndEditOpen, setAddAndEditOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const [checkFeatureList, setCheckFeatureList] = useState<boolean>(false);
  const [checkFeatureCreate, setCheckFeatureCreate] = useState<boolean>(false);
  const [checkFeatureUpdate, setCheckFeatureUpdate] = useState<boolean>(false);
  const [checkFeatureDelete, setCheckFeatureDelete] = useState<boolean>(false);

  const [menuCheckBoxSelected, setMenuCheckBoxSelected] = useState<number[]>([]);

  const onError = (errors, e) => console.log(errors, e);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { register: registerRole, handleSubmit: handleSubmitRole, setValue: setRoleValue, getValues: getRoleValue,
    watch: watchRole, reset: resetRole, formState: { errors: roleErrors } } = useForm(
      {
        defaultValues: {
          name: "",
          key: "",
          status: true,
          weight: 0,
          remark: "",
        }
      });


  useEffect(() => {
    getData(null);
    unstable_batchedUpdates(() => {
      setCheckFeatureList(validAuthMenuFeature(AuthMenu.state, "role_list"));   //權限 列表
      setCheckFeatureCreate(validAuthMenuFeature(AuthMenu.state, "role_create")); //權限 新增
      setCheckFeatureUpdate(validAuthMenuFeature(AuthMenu.state, "role_update")); //權限 修改
      setCheckFeatureDelete(validAuthMenuFeature(AuthMenu.state, "role_delete")); //權限 刪除
    });
  }, []);

  useEffect(() => { }, [watchRole()]);

  function getData(ds: PageManagement | null) {
    roleListApi(ds, state)
      .then(res => {
        setTableState({ data: res.data.roleList, pageManagement: res.data.pageManagement, isLoading: false });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  const handleAddClickOpen = () => {
    getMenuCheckBoxList().then(() => {
      unstable_batchedUpdates(() => {
        setMenuCheckBoxSelected([]);
        setAddAndEditStatus("add");
        setAddAndEditOpen(true);
        resetRole();
      });
    });
  };

  const handleEditClickOpen = async (id: number) => {
    await Promise.all([getMenuCheckBoxList(), getEditDataById(id)]).then(() => {
      unstable_batchedUpdates(() => {
        setAddAndEditStatus("edit");
        setAddAndEditOpen(true)
        setSelectedId(id);
      });
    })
  };

  const handleAddAndEditClose = () => {
    unstable_batchedUpdates(() => {
      setAddAndEditOpen(false);
      resetRole();
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
    await roleInfoApi(id, state)
      .then(res => {
        let data = res.data.roleInfo;
        let roleMenu = res.data.roleMenu;
        setMenuCheckBoxSelected(roleMenu);
        setRoleValue("name", data.name, { shouldValidate: true });
        setRoleValue("key", data.key, { shouldValidate: true });
        setRoleValue("status", data.status, { shouldValidate: true });
        setRoleValue("weight", data.weight, { shouldValidate: true });
        setRoleValue("remark", data.remark, { shouldValidate: true });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function getDialogRoleData(): RoleData {
    var roleData: RoleData = {
      name: getRoleValue("name"),
      key: getRoleValue("key"),
      status: Boolean(Number(getRoleValue("status"))),
      weight: Number(getRoleValue("weight")),
      remark: getRoleValue("remark"),
      roleMenu: menuCheckBoxSelected,
    }
    return roleData;
  }

  const submitAddRole = (formObj, event) => {
    let roleData = getDialogRoleData();
    console.log(roleData);
    addRole(roleData);
  };

  const submitEditRole = (formObj, event) => {
    let roleData = getDialogRoleData();
    console.log(roleData);
    editRole(roleData);
  };

  // 樹狀權限關聯
  const setMenuCheckBox = (value: number[]) => {
    setMenuCheckBoxSelected(value);
  }

  async function getMenuCheckBoxList() {
    await menuAllListApi(null, state)
      .then(res => {
        let defaultRootNode: MenuTree = {
          feature: "T",
          id: 0,
          key: "",
          name: "全選",
          parent: 0,
          status: 1,
          url: "",
          weight: 9999,
        }
        defaultRootNode.children = makeRecursionTree<MenuTree>(res.data.menuList, 0);
        setMenuCheckboxList(defaultRootNode);
      }).catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function addRole(data: any) {
    // console.log(data);
    roleAddApi(data, state)
      .then(res => {
        handleAddAndEditClose();
        getData({ ...tableState.pageManagement });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function editRole(data: any) {
    // console.log(data);
    roleEditApi(selectedId, data, state)
      .then(res => {
        handleAddAndEditClose();
        getData({ ...tableState.pageManagement });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function deleteRole() {
    // console.log(selectedIndex);
    roleDeleteApi(selectedId, state)
      .then(res => {
        handleDeleteClose();
        getData({ ...tableState.pageManagement });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function deleteMultipleRole(ids: number[]) {
    roleDeleteMultipleApi({ id: ids }, state)
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
      key: data.get("key").toString(),
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
    deleteMultipleRole(deleteIds);
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
      name: "key",
      label: "key",
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
      name: "weight",
      label: "權重",
      options: {
        sort: true,
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
          let data = `id:${rowData.id},key:${rowData.key}`;
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
      }
    },
  };

  return (
    <>
      <SuspenseLoader isOpen={tableState.isLoading} />
      <Helmet>
        <title>Role</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          title={"權限"}
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
          <RoleSearch
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
                      Role List
                      {tableState.isLoading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>
                  }
                  data={tableState.data}
                  columns={columns}
                  options={options}
                />
              }
            </DataTableThemeProvider>
            <RoleAddAndEditDialog
              selectedId={selectedId}
              menuCheckBoxList={menuCheckboxList}
              menuCheckBox={menuCheckBoxSelected}
              setMenuCheckBox={setMenuCheckBox}
              addAndEditStatus={addAndEditStatus}
              addAndEditOpen={addAndEditOpen}
              handleAddAndEditClose={handleAddAndEditClose}
              submitAddRole={submitAddRole}
              submitEditRole={submitEditRole}
              onError={onError}
              registerRole={registerRole}
              handleSubmitRole={handleSubmitRole}
              getRoleValue={getRoleValue}
              roleErrors={roleErrors}
            />

            {/* 刪除 */}
            <DataTableDialog
              title={"刪除角色"}
              maxWidth="xs"
              isOpen={deleteOpen}
              handleClose={handleDeleteClose}
              submit={deleteRole}
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

export default Role;
