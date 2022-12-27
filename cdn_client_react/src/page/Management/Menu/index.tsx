import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { Box, CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableState } from "mui-datatables";
import { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from "react-dom";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from 'react-intl';
import { menuAddApi, menuAllListApi, menuDeleteApi, menuDeleteMultipleApi, menuEditApi, menuInfoApi, menuListApi } from 'src/api/Menu/menuApi';
import { ColumnIconButton } from 'src/components/DataTable/CustomerIconRender';
import { CustomBodyTime } from 'src/components/DataTable/CustomerRender';
import DataTableDialog from 'src/components/DataTable/DataTableDialog';
import getDataTableState, { DataTableStatus, PageManagement, Search, setPageManagement } from 'src/components/DataTable/DataTableState';
import DataTableThemeProvider from 'src/components/DataTable/DataTableThemeProvider';
import getTextLabels from 'src/components/DataTable/TextLabels';
import Label from 'src/components/Label';
import PageContent from 'src/components/PageContent';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import SuspenseLoader from 'src/components/SuspenseLoader';
import Title from 'src/components/Title';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import { useAuthMenuContext } from 'src/contexts/AuthMenuContext';
import { validAuthMenuFeature } from 'src/middleware/authMenuMiddleware';
import MenuAddAndEditDialog from './MenuAddAndEditDialog';
import MenuSearch from './MenuSearch';

export interface MapStyle {
  [key: number | string]: { label: string, color: "primary" | "secondary" | "error" | "black" | "warning" | "success" | "info" }
}

const statusMap: MapStyle = {
  0: { label: '停用', color: 'error' },
  1: { label: '啟用', color: 'primary' }
}

const featureMap: MapStyle = {
  'T': { label: '標題', color: 'black' },
  'P': { label: '頁面', color: 'primary' },
  'F': { label: '按鍵功能', color: 'secondary' }
}

export interface MenuListSelect {
  id: number,
  name: string,
  key: string,
  feature: string,
}

interface MenuData {
  name: string,
  key: string,
  url: string,
  feature: string,
  status: boolean,
  parent: number,
  weight: number,
  remark: string,
}

function Menu() {
  const intl = useIntl();
  const theme = useTheme();
  const AuthMenu = useAuthMenuContext();
  const { state } = useAuthStateContext();
  const [tableState, setTableState] = useState<DataTableStatus>(getDataTableState());
  const [menuListSelect, setMenuListSelect] = useState<MenuListSelect[]>([]);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedData, setSelectedData] = useState<string>("");
  const [addAndEditStatus, setAddAndEditStatus] = useState<"edit" | "add" | "">("");
  const [addAndEditOpen, setAddAndEditOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const [checkFeatureList, setCheckFeatureList] = useState<boolean>(false);
  const [checkFeatureCreate, setCheckFeatureCreate] = useState<boolean>(false);
  const [checkFeatureUpdate, setCheckFeatureUpdate] = useState<boolean>(false);
  const [checkFeatureDelete, setCheckFeatureDelete] = useState<boolean>(false);

  const onError = (errors, e) => console.log(errors, e);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { register: registerMenu, handleSubmit: handleSubmitMenu, setValue: setMenuValue, getValues: getMenuValue,
    watch: watchMenu, reset: resetMenu, formState: { errors: menuErrors } } = useForm(
      {
        defaultValues: {
          name: "",
          key: "",
          url: "",
          feature: "T",
          status: true,
          parent: 0,
          weight: 0,
          remark: "",
        }
      });


  useEffect(() => {
    getData(null);
    unstable_batchedUpdates(() => {
      setCheckFeatureList(validAuthMenuFeature(AuthMenu.state, "menu_list"));   //權限 列表
      setCheckFeatureCreate(validAuthMenuFeature(AuthMenu.state, "menu_create")); //權限 新增
      setCheckFeatureUpdate(validAuthMenuFeature(AuthMenu.state, "menu_update")); //權限 修改
      setCheckFeatureDelete(validAuthMenuFeature(AuthMenu.state, "menu_delete")); //權限 刪除
    });
  }, []);

  useEffect(() => { }, [watchMenu()]);

  function getData(ds: PageManagement | null) {
    menuListApi(ds, state)
      .then(res => {
        setTableState({ data: res.data.menuList, pageManagement: res.data.pageManagement, isLoading: false });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.message);
      });
  }

  const handleAddClickOpen = () => {
    getMenuAllList().then(() => {
      unstable_batchedUpdates(() => {
        setAddAndEditStatus("add");
        setAddAndEditOpen(true);
        resetMenu();
      })
    });
  };

  const handleEditClickOpen = async (id: number) => {
    await Promise.all([getMenuAllList(), getEditDataById(id)]).then(() => {
      unstable_batchedUpdates(() => {
        setAddAndEditStatus("edit");
        setAddAndEditOpen(true);
        setSelectedId(id);
      });
    });
  };

  const handleAddAndEditClose = () => {
    unstable_batchedUpdates(() => {
      setAddAndEditOpen(false);
      resetMenu();
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

  async function getMenuAllList() {
    await menuAllListApi(null, state)
      .then(res => {
        let defaultMenuList: MenuListSelect = {
          id: 0,
          name: "無",
          key: "",
          feature: "T",
        }
        setMenuListSelect([
          defaultMenuList,
          ...res.data.menuList
        ]);
      }).catch(error => {
        console.log("error:" + error.response?.data?.message);
      });
  }

  async function getEditDataById(id: number) {
    await menuInfoApi(id, state)
      .then(res => {
        let data = res.data.menuInfo;
        setMenuValue("name", data.name, { shouldValidate: true });
        setMenuValue("key", data.key, { shouldValidate: true });
        setMenuValue("url", data.url, { shouldValidate: true });
        setMenuValue("feature", data.feature, { shouldValidate: true });
        setMenuValue("status", data.status, { shouldValidate: true });
        setMenuValue("parent", data.parent, { shouldValidate: true });
        setMenuValue("weight", data.weight, { shouldValidate: true });
        setMenuValue("remark", data.remark, { shouldValidate: true });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.message);
      });
  }

  function getDialogMenuData(): MenuData {
    var menuData: MenuData = {
      name: getMenuValue("name"),
      key: getMenuValue("key"),
      url: getMenuValue("url"),
      feature: getMenuValue("feature"),
      status: Boolean(Number(getMenuValue("status"))),
      parent: Number(getMenuValue("parent")),
      weight: Number(getMenuValue("weight")),
      remark: getMenuValue("remark"),
    }
    return menuData;
  }

  const submitAddMenu = (formObj, event) => {
    let menuData = getDialogMenuData();
    console.log(menuData);
    addMenu(menuData);
  };

  const submitEditMenu = (formObj, event) => {
    let menuData = getDialogMenuData();
    console.log(menuData);
    editMenu(menuData);
  };

  function addMenu(data: any) {
    // console.log(data);
    menuAddApi(data, state)
      .then(res => {
        handleAddAndEditClose();
        getData({ ...tableState.pageManagement });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.message);
      });
  }

  function editMenu(data: any) {
    // console.log(data);
    menuEditApi(selectedId, data, state)
      .then(res => {
        handleAddAndEditClose();
        getData({ ...tableState.pageManagement });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.message);
      });
  }

  function deleteMenu() {
    // console.log(selectedIndex);
    menuDeleteApi(selectedId, state)
      .then(res => {
        handleDeleteClose();
        getData({ ...tableState.pageManagement });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.message);
      });
  }

  function deleteMultipleMenu(ids: number[]) {
    menuDeleteMultipleApi({ id: ids }, state)
      .then(res => {
        getData({ ...tableState.pageManagement });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.message);
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
      url: data.get("url").toString(),
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
    deleteMultipleMenu(deleteIds);
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
      label: intl.formatMessage({
        id: 'page.name',
        defaultMessage: '名稱',
      }),
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
      name: "url",
      label: intl.formatMessage({
        id: 'page.menu.url',
        defaultMessage: '網址',
      }),
      options: {
        sort: true,
      }
    },
    {
      name: "feature",
      label: intl.formatMessage({
        id: 'page.menu.feature',
        defaultMessage: '功能',
      }),
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => (
          <>
            {(featureMap[value]) &&
              < Label color={featureMap[value].color}>{featureMap[value].label}</Label>
            }
          </>
        )
      }
    },
    {
      name: "status",
      label: intl.formatMessage({
        id: 'page.status',
        defaultMessage: '狀態',
      }),
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
      name: "parent",
      label: intl.formatMessage({
        id: 'page.menu.parents',
        defaultMessage: '選單(父類別)',
      }),
      options: {
        sort: true,
        display: false,
      }
    },
    {
      name: "weight",
      label: intl.formatMessage({
        id: 'page.weight',
        defaultMessage: '權重',
      }),
      options: {
        sort: true,
      }
    },
    {
      name: "createdAt",
      label: intl.formatMessage({
        id: 'page.create.day',
        defaultMessage: '創建日期',
      }),
      options: {
        sort: true,
        display: false,
        customBodyRender: CustomBodyTime
      }
    },
    {
      name: "updatedAt",
      label: intl.formatMessage({
        id: 'page.update.day',
        defaultMessage: '修改日期',
      }),
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
                  title={
                    intl.formatMessage({
                      id: 'page.update',
                      defaultMessage: '修改',
                    })
                  }
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
                  title={
                    intl.formatMessage({
                      id: 'page.delete',
                      defaultMessage: '刪除',
                    })
                  }
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
      <Title />
      <PageTitleWrapper>
        <PageHeader
          title={
            intl.formatMessage({
              id: 'page.menu',
              defaultMessage: '選單',
            })
          }
          subTitle={""}
        />
      </PageTitleWrapper>
      <PageContent
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
        >
          <MenuSearch
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
                    <Typography variant="h5">
                      <FormattedMessage
                        id="page.menu.title"
                        defaultMessage="選單列表"
                      />
                      {tableState.isLoading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>
                  }
                  data={tableState.data}
                  columns={columns}
                  options={options}
                />
              }
            </DataTableThemeProvider>

            <MenuAddAndEditDialog
              menuListMap={menuListSelect}
              featureMap={featureMap}
              selectedId={selectedId}
              addAndEditStatus={addAndEditStatus}
              addAndEditOpen={addAndEditOpen}
              handleAddAndEditClose={handleAddAndEditClose}
              submitAddMenu={submitAddMenu}
              submitEditMenu={submitEditMenu}
              onError={onError}
              registerMenu={registerMenu}
              handleSubmitMenu={handleSubmitMenu}
              getMenuValue={getMenuValue}
              menuErrors={menuErrors}
            />

            {/* 刪除 */}
            <DataTableDialog
              title={
                intl.formatMessage({
                  id: 'page.delete',
                  defaultMessage: '刪除',
                }) +
                intl.formatMessage({
                  id: 'page.menu',
                  defaultMessage: '選單',
                })
              }
              maxWidth="xs"
              isOpen={deleteOpen}
              handleClose={handleDeleteClose}
              submit={deleteMenu}
            >
              <Box component="span" sx={{ typography: "h4" }}>
                {intl.formatMessage({
                  id: 'page.delete.comfirm',
                  defaultMessage: '是否要刪除',
                }) + selectedData}
              </Box>

            </DataTableDialog >
          </Grid >
        </Grid >
      </PageContent >
      {/* <Footer /> */}
    </>
  );
}

export default Menu;
