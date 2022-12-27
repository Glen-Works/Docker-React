import { Checkbox, FormControlLabel, Grid, MenuItem, Switch, TextField, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import DataTableDialog from "src/components/DataTable/DataTableDialog";
import DialogFormat from "src/components/Dialog/DialogFormat";
import TextArea from "src/components/Input/TextArea";
import { MapStyle, RoleListSelect } from ".";

interface UserAddAndEditDialogProp {
  selectedId: number,
  roleListSelect: RoleListSelect[],
  roleCheckBoxSelected: number[],
  setRoleCheckBoxSelected: (value: number[]) => void,
  addAndEditStatus: string,
  addAndEditOpen: boolean,
  userTypeMap: MapStyle,
  handleAddAndEditClose: () => void,
  submitAddUser: (formObj, event) => void,
  submitEditUser: (formObj, event) => void,
  onError: (errors, e) => void,
  registerUser: any,
  handleSubmitUser: any,
  getUserValue: any,
  userErrors: any,
}

export default function UserAddAndEditDialog(props: UserAddAndEditDialogProp) {
  const {
    selectedId,
    roleListSelect,
    roleCheckBoxSelected,
    setRoleCheckBoxSelected,
    addAndEditStatus,
    addAndEditOpen,
    userTypeMap,
    handleAddAndEditClose,
    submitAddUser,
    submitEditUser,
    onError,
    registerUser,
    handleSubmitUser,
    getUserValue,
    userErrors,
  } = props;

  const intl = useIntl();

  function getOnChange(checked: boolean, id: number) {
    let selectItems = checked
      ? [...roleCheckBoxSelected, id]
      : roleCheckBoxSelected.filter((value: number) => (value != id));

    setRoleCheckBoxSelected(selectItems);
  }

  return (
    <>
      <DataTableDialog
        title={(addAndEditStatus == "add") ?
          intl.formatMessage({
            id: 'page.create',
            defaultMessage: '新增',
          }) +
          intl.formatMessage({
            id: 'page.user',
            defaultMessage: '使用者',
          })
          : intl.formatMessage({
            id: 'page.update',
            defaultMessage: '修改',
          }) +
          intl.formatMessage({
            id: 'page.user',
            defaultMessage: '使用者',
          })}
        maxWidth="md"
        isOpen={addAndEditOpen}
        handleClose={handleAddAndEditClose}
        submit={handleSubmitUser((addAndEditStatus == "add") ? submitAddUser : submitEditUser, onError)}
      >
        <Grid container justifyContent="center" alignItems="center" direction="column" >
          {(addAndEditStatus == "edit") &&
            <DialogFormat title="ID :" >
              <Typography >{selectedId}</Typography>
            </DialogFormat>
          }
          <DialogFormat title={
            intl.formatMessage({
              id: 'page.name',
              defaultMessage: '名稱',
            })
          } >
            <TextField
              name="name"
              value={getUserValue("name")}
              {...registerUser("name", {
                required: "Required field"
              })}
              fullWidth={true}
              error={!!userErrors?.name}
              helperText={userErrors?.name ? userErrors.name.message : null}
            />
          </DialogFormat>

          <DialogFormat title={
            intl.formatMessage({
              id: 'page.user.email',
              defaultMessage: '信箱',
            })
          } >
            <TextField
              name="email"
              value={getUserValue("email")}
              {...registerUser("email", {
                required: "Required field",
                minLength: {
                  value: 5, message: intl.formatMessage({
                    id: 'error.min.length',
                    defaultMessage: '至少 {length} 字',
                  }, { 'length': '5' })
                },
                maxLength: {
                  value: 100, message: intl.formatMessage({
                    id: 'error.max.length',
                    defaultMessage: '至少 {length} 字',
                  }, { 'length': '100' })
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9._]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                }
              })}
              fullWidth={true}
              error={!!userErrors?.email}
              helperText={userErrors?.email ? userErrors.email.message : null}
            />
          </DialogFormat>
          {(addAndEditStatus == "add") &&
            <DialogFormat title={
              intl.formatMessage({
                id: 'page.user.password',
                defaultMessage: '密碼',
              })
            } >
              <TextField
                id="password"
                name="password"
                type="password"
                {...registerUser("password", {
                  required: "Required field",
                  minLength: {
                    value: 5, message: intl.formatMessage({
                      id: 'error.min.length',
                      defaultMessage: '至少 {length} 字',
                    }, { 'length': '5' })
                  },
                  maxLength: {
                    value: 100, message: intl.formatMessage({
                      id: 'error.max.length',
                      defaultMessage: '至少 {length} 字',
                    }, { 'length': '100' })
                  },
                })}
                fullWidth={true}
                error={!!userErrors?.password}
                helperText={userErrors?.password ? userErrors.password.message : null}
              />
            </DialogFormat>
          }
          <DialogFormat title={
            intl.formatMessage({
              id: 'page.status',
              defaultMessage: '狀態',
            })
          } >
            <Switch
              id="status"
              name="status"
              checked={Boolean(Number(getUserValue("status")))}
              {...registerUser("status", {
              })}
            />
          </DialogFormat>
          <DialogFormat title={
            intl.formatMessage({
              id: 'page.user.identity',
              defaultMessage: '身份',
            })
          } >
            <TextField
              id="userType"
              name="userType"
              select
              value={getUserValue("userType")}
              {...registerUser("userType", {
                required: "Required field"
              })}
              fullWidth={true}
              error={!!userErrors?.userType}
              helperText={userErrors?.userType ? userErrors.userType.message : null}
            >
              {Object.keys(userTypeMap).map((value) => (
                <MenuItem key={value} value={value}>
                  {userTypeMap[value].label}
                </MenuItem>
              ))
              }
            </TextField>
          </DialogFormat>
          <DialogFormat title={
            intl.formatMessage({
              id: 'page.user.role',
              defaultMessage: '權限',
            })
          } >
            {roleListSelect.map((role) => (
              <FormControlLabel
                control={<Checkbox
                  checked={roleCheckBoxSelected.includes(role.id)}
                  onChange={(event) => getOnChange(event.currentTarget.checked, role.id)}
                />
                }
                label={<>{role.name}</>}
                key={"role_" + role.id}
              />
            ))}
          </DialogFormat>
          <DialogFormat title={
            intl.formatMessage({
              id: 'page.remark',
              defaultMessage: '備註',
            })
          } >
            <TextArea
              minRows={5}
              maxRows={8}
              id="remark"
              name="remark"
              value={getUserValue("remark") ?? ""}
              {...registerUser("remark", {})}
            />
          </DialogFormat>
        </Grid>
      </DataTableDialog>
    </>
  )
}