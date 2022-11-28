import { Grid, Switch, TextField, Typography } from "@mui/material";
import DataTableDialog from "src/components/DataTable/DataTableDialog";
import DialogFormat from "src/components/DataTable/DialogFormat";
import TextArea from "src/components/Input/TextArea";
import { MapStyle } from ".";


interface MenuAddAndEditDialogProp {
  featureMap: MapStyle
  selectedId: number,
  addAndEditStatus: string,
  addAndEditOpen: boolean,
  handleAddAndEditClose: () => void,
  submitAddMenu: (formObj, event) => void,
  submitEditMenu: (formObj, event) => void,
  onError: (errors, e) => void,
  registerMenu: any,
  handleSubmitMenu: any,
  getMenuValue: any,
  menuErrors: any,
}

export default function MenuAddAndEditDialog(props: MenuAddAndEditDialogProp) {
  const {
    featureMap,
    selectedId,
    addAndEditStatus,
    addAndEditOpen,
    handleAddAndEditClose,
    submitAddMenu,
    submitEditMenu,
    onError,
    registerMenu,
    handleSubmitMenu,
    getMenuValue,
    menuErrors,
  } = props;

  return (
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
        <DialogFormat title="選單(父類別) :" >
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
  )
}