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
import { roleAddApi, roleDeleteApi, roleEditApi, roleInfoApi, roleListApi } from 'src/api/Role/roleApi';
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
}

function Role() {

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
    unstable_batchedUpdates(() => {
      setAddAndEditStatus("add");
      setAddAndEditOpen(true);
      resetRole();
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
        let data = res.data[0];
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
        <title>Role</title>
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
                    Role List
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
              title={(addAndEditStatus == "add") ? "新增角色" : "修改角色"}
              maxWidth="md"
              isOpen={addAndEditOpen}
              handleClose={handleAddAndEditClose}
              submit={handleSubmitRole((addAndEditStatus == "add") ? submitAddRole : submitEditRole, onError)}
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
                    defaultValue={getRoleValue("name")}
                    {...registerRole("name", {
                      required: "Required field"
                    })}
                    fullWidth={true}
                    error={!!roleErrors?.name}
                    helperText={roleErrors?.name ? roleErrors.name.message : null}
                  />
                </DialogFormat>
                <DialogFormat title="key :" >
                  <TextField
                    id="key"
                    name="key"
                    defaultValue={getRoleValue("status")}
                    {...registerRole("key", {
                      required: "Required field",
                    })}
                    fullWidth={true}
                    error={!!roleErrors?.key}
                    helperText={roleErrors?.key ? roleErrors.key.message : null}
                  />
                </DialogFormat>
                <DialogFormat title="狀態 :" >
                  <Switch
                    id="status"
                    name="status"
                    checked={Boolean(Number(getRoleValue("status")))}
                    {...registerRole("status", {
                    })}
                  />
                </DialogFormat>
                <DialogFormat title="權重 :" >
                  <TextField
                    id="weight"
                    name="weight"
                    defaultValue={Number(getRoleValue("weight"))}
                    {...registerRole("weight", {
                      min: { value: 0, message: "Minimum value is 0" },
                      max: { value: 32766, message: "Maximum value is 32766" },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Invalid value,value must be a number",
                      }
                    })}
                    fullWidth={true}
                    error={!!roleErrors?.weight}
                    helperText={roleErrors?.weight ? roleErrors.weight.message : null}
                  />
                </DialogFormat>
                <DialogFormat title="備註 :" >
                  <TextArea
                    minRows={5}
                    maxRows={8}
                    id="remark"
                    name="remark"
                    defaultValue={getRoleValue("remark")}
                    {...registerRole("remark", {})}
                  />
                </DialogFormat>
              </Grid>
            </DataTableDialog>

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