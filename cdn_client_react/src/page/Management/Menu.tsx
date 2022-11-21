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

  const { register: registerMenu, handleSubmit: handleSubmitMenu, setValue: setMenuValue, getValues: getMenuValue,
    watch: watchMenu, reset: resetMenu, formState: { errors: menuErrors } } = useForm(
      {
        defaultValues: {
          name: "",
          key: "",
          url: "",
          feature: "",
          status: true,
          parent: 0,
          weight: 0,
          remark: "",
        }
      });


  useEffect(() => {
    getData(null);
  }, []);

  useEffect(() => { }, [watchMenu()]);

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
      resetMenu();
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

  async function getEditDataById(id: number) {
    await menuInfoApi(id, state)
      .then(res => {
        let data = res.data[0];
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
        console.log("error:" + error.response?.data?.msg);
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
        console.log("error:" + error.response?.data?.msg);
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
        console.log("error:" + error.response?.data?.msg);
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
      url: data.get("url").toString(),
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
      name: "key",
      label: "key",
      options: {
        sort: true,
      }
    },
    {
      name: "url",
      label: "url",
      options: {
        sort: true,
      }
    },
    {
      name: "feature",
      label: "feature",
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
      name: "parent",
      label: "parent",
      options: {
        sort: true,
        display: false,
      }
    },
    {
      name: "weight",
      label: "weight",
      options: {
        sort: true,
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
          let data = `id:${rowData.id},key:${rowData.key}`;
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
                  id="key"
                  label="Key"
                  name="key"
                  autoComplete="key"
                  size="small"
                  type="search"
                  {...register("key", {})}
                />
              </Grid>
              <Grid item >
                <TextField
                  id="url"
                  label="Url"
                  name="url"
                  autoComplete="url"
                  size="small"
                  type="search"
                  {...register("url", {})}
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
              title={(addAndEditStatus == "add") ? "新增菜單" : "修改菜單"}
              maxWidth="md"
              isOpen={addAndEditOpen}
              handleClose={handleAddAndEditClose}
              submit={handleSubmitMenu((addAndEditStatus == "add") ? submitAddMenu : submitEditMenu, onError)}
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
                    defaultValue={getMenuValue("name")}
                    {...registerMenu("name", {
                      required: "Required field"
                    })}
                    fullWidth={true}
                    error={!!menuErrors?.name}
                    helperText={menuErrors?.name ? menuErrors.name.message : null}
                  />
                </DialogFormat>
                <DialogFormat title="key :" >
                  <TextField
                    id="key"
                    name="key"
                    defaultValue={getMenuValue("status")}
                    {...registerMenu("key", {
                      required: "Required field",
                    })}
                    fullWidth={true}
                    error={!!menuErrors?.key}
                    helperText={menuErrors?.key ? menuErrors.key.message : null}
                  />
                </DialogFormat>
                <DialogFormat title="url :" >
                  <TextField
                    id="url"
                    name="url"
                    defaultValue={getMenuValue("url")}
                    {...registerMenu("url", {
                      required: "Required field",
                    })}
                    fullWidth={true}
                    error={!!menuErrors?.url}
                    helperText={menuErrors?.url ? menuErrors.url.message : null}
                  />
                </DialogFormat>
                <DialogFormat title="功能 :" >
                  <TextField
                    id="feature"
                    name="feature"
                    select
                    SelectProps={{
                      native: true,
                    }}
                    defaultValue={getMenuValue("feature")}
                    {...registerMenu("feature", {
                      required: "Required field"
                    })}
                    fullWidth={true}
                    error={!!menuErrors?.feature}
                    helperText={menuErrors?.feature ? menuErrors.feature.message : null}
                  >
                    {Object.keys(featureMap).map((value) => (
                      <option key={value} value={value}>
                        {featureMap[value].label}
                      </option>
                    ))
                    }
                  </TextField>
                </DialogFormat>
                <DialogFormat title="狀態 :" >
                  <Switch
                    id="status"
                    name="status"
                    checked={Boolean(Number(getMenuValue("status")))}
                    {...registerMenu("status", {
                    })}
                  />
                </DialogFormat>
                <DialogFormat title="parent :" >
                  <TextField
                    id="parent"
                    name="parent"
                    defaultValue={getMenuValue("parent")}
                    {...registerMenu("parent", {
                      required: "Required field",
                    })}
                    fullWidth={true}
                    error={!!menuErrors?.parent}
                    helperText={menuErrors?.parent ? menuErrors.parent.message : null}
                  />
                </DialogFormat>
                <DialogFormat title="權重 :" >
                  <TextField
                    id="weight"
                    name="weight"
                    defaultValue={Number(getMenuValue("weight"))}
                    {...registerMenu("weight", {
                      min: { value: 0, message: "Minimum value is 0" },
                      max: { value: 32766, message: "Maximum value is 32766" },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Invalid value,value must be a number",
                      }
                    })}
                    fullWidth={true}
                    error={!!menuErrors?.weight}
                    helperText={menuErrors?.weight ? menuErrors.weight.message : null}
                  />
                </DialogFormat>
                <DialogFormat title="備註 :" >
                  <TextArea
                    minRows={5}
                    maxRows={8}
                    id="remark"
                    name="remark"
                    defaultValue={getMenuValue("remark")}
                    {...registerMenu("remark", {})}
                  />
                </DialogFormat>
              </Grid>
            </DataTableDialog>

            {/* 刪除 */}
            <DataTableDialog
              title={"刪除菜單"}
              maxWidth="xs"
              isOpen={deleteOpen}
              handleClose={handleDeleteClose}
              submit={deleteMenu}
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
