import { Grid, Switch, TextField, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import DataTableDialog from "src/components/DataTable/DataTableDialog";
import DialogFormat from "src/components/Dialog/DialogFormat";
import TextArea from "src/components/Input/TextArea";
import TreeCheckBox from "src/components/TreeCheckBox/TreeCheckBox";
import { MenuTree } from "src/middleware/authMenuMiddleware";


interface RoleAddAndEditDialogProp {
  selectedId: number,
  menuCheckBoxList: MenuTree,
  menuCheckBox: number[],
  setMenuCheckBox: (value: number[]) => void,
  addAndEditStatus: string,
  addAndEditOpen: boolean,
  handleAddAndEditClose: () => void,
  submitAddRole: (formObj, event) => void,
  submitEditRole: (formObj, event) => void,
  onError: (errors, e) => void,
  registerRole: any,
  handleSubmitRole: any,
  getRoleValue: any,
  roleErrors: any,
}

export default function RoleAddAndEditDialog(props: RoleAddAndEditDialogProp) {
  const {
    selectedId,
    menuCheckBoxList: menuCheckboxList,
    menuCheckBox,
    setMenuCheckBox,
    addAndEditStatus,
    addAndEditOpen,
    handleAddAndEditClose,
    submitAddRole,
    submitEditRole,
    onError,
    registerRole,
    handleSubmitRole,
    getRoleValue,
    roleErrors,
  } = props;

  const intl = useIntl();

  return (
    <DataTableDialog
      title={(addAndEditStatus == "add") ?
        intl.formatMessage({
          id: 'page.create',
          defaultMessage: '新增',
        }) +
        intl.formatMessage({
          id: 'page.role',
          defaultMessage: '權限',
        })
        : intl.formatMessage({
          id: 'page.update',
          defaultMessage: '修改',
        }) +
        intl.formatMessage({
          id: 'page.role',
          defaultMessage: '權限',
        })}
      maxWidth="md"
      isOpen={addAndEditOpen}
      handleClose={handleAddAndEditClose}
      submit={handleSubmitRole((addAndEditStatus == "add") ? submitAddRole : submitEditRole, onError)}
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
            value={getRoleValue("name")}
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
            name="key"
            value={getRoleValue("key")}
            {...registerRole("key", {
              required: "Required field",
            })}
            fullWidth={true}
            error={!!roleErrors?.key}
            helperText={roleErrors?.key ? roleErrors.key.message : null}
          />
        </DialogFormat>
        <DialogFormat title={
          intl.formatMessage({
            id: 'page.status',
            defaultMessage: '狀態',
          })
        } >
          <Switch
            name="status"
            checked={Boolean(Number(getRoleValue("status")))}
            {...registerRole("status", {
            })}
          />
        </DialogFormat>
        <DialogFormat title={
          intl.formatMessage({
            id: 'page.weight',
            defaultMessage: '權重',
          })
        }>
          <TextField
            name="weight"
            type="number"
            value={Number(getRoleValue("weight"))}
            {...registerRole("weight", {
              max: {
                value: 32766, message: intl.formatMessage({
                  id: 'error.max.length',
                  defaultMessage: '最大值為 {length}',
                }, { 'length': '32766' })
              }
            })}
            fullWidth={true}
            error={!!roleErrors?.weight}
            helperText={roleErrors?.weight ? roleErrors.weight.message : null}
          />
        </DialogFormat>
        <DialogFormat title={
          intl.formatMessage({
            id: 'page.role',
            defaultMessage: '權限',
          })
        } >
          <TreeCheckBox
            data={menuCheckboxList}
            setSelected={setMenuCheckBox}
            selected={menuCheckBox} />
          {/* (addAndEditStatus == "add") ? "新增權限" : "修改權限" */}
        </DialogFormat>
        <DialogFormat title={
          intl.formatMessage({
            id: 'page.remark',
            defaultMessage: '備註',
          })
        }>
          <TextArea
            minRows={5}
            maxRows={8}
            name="remark"
            value={getRoleValue("remark") ?? ""}
            {...registerRole("remark", {})}
          />
        </DialogFormat>
      </Grid>
    </DataTableDialog>
  )
}