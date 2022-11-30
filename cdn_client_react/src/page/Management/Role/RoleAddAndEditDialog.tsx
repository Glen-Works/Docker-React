import { Grid, Switch, TextField, Typography } from "@mui/material";
import DataTableDialog from "src/components/DataTable/DataTableDialog";
import DialogFormat from "src/components/Dialog/DialogFormat";
import TextArea from "src/components/Input/TextArea";


interface RoleAddAndEditDialogProp {
  selectedId: number,
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

  return (
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
            <Typography variant="h5" textAlign="left">{selectedId}</Typography>
          </DialogFormat>
        }
        <DialogFormat title="名稱 :" >
          <TextField
            id="name"
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
            id="key"
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
            type="number"
            value={Number(getRoleValue("weight"))}
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
            value={getRoleValue("remark")}
            {...registerRole("remark", {})}
          />
        </DialogFormat>
      </Grid>
    </DataTableDialog>
  )
}