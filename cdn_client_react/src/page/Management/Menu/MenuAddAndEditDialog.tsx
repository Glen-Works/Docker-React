import { Grid, MenuItem, Switch, TextField, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import DataTableDialog from "src/components/DataTable/DataTableDialog";
import DialogFormat from "src/components/Dialog/DialogFormat";
import TextArea from "src/components/Input/TextArea";
import { MapStyleBase } from "src/utils/baseFunction";
import { MenuListSelect } from ".";


interface MenuAddAndEditDialogProp {
  menuListMap: MenuListSelect[],
  featureMap: MapStyleBase,
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
  const intl = useIntl();

  const {
    menuListMap,
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
      title={(addAndEditStatus == "add") ?
        intl.formatMessage({
          id: 'page.create',
          defaultMessage: '新增',
        }) +
        intl.formatMessage({
          id: 'page.menu',
          defaultMessage: '選單',
        })
        : intl.formatMessage({
          id: 'page.update',
          defaultMessage: '修改',
        }) +
        intl.formatMessage({
          id: 'page.menu',
          defaultMessage: '選單',
        })}
      maxWidth="md"
      isOpen={addAndEditOpen}
      handleClose={handleAddAndEditClose}
      submit={handleSubmitMenu((addAndEditStatus == "add") ? submitAddMenu : submitEditMenu, onError)}
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
            value={getMenuValue("name")}
            {...registerMenu("name", {
              required: intl.formatMessage({
                id: 'error.required',
                defaultMessage: '必填欄位',
              })
            })}
            fullWidth={true}
            error={!!menuErrors?.name}
            helperText={menuErrors?.name ? menuErrors.name.message : null}
          />
        </DialogFormat>
        <DialogFormat title="key :" >
          <TextField
            name="key"
            value={getMenuValue("key")}
            {...registerMenu("key", {
              required: intl.formatMessage({
                id: 'error.required',
                defaultMessage: '必填欄位',
              }),
            })}
            fullWidth={true}
            error={!!menuErrors?.key}
            helperText={menuErrors?.key ? menuErrors.key.message : null}
          />
        </DialogFormat>
        <DialogFormat title={
          intl.formatMessage({
            id: 'page.menu.url',
            defaultMessage: '網址',
          })
        }  >
          <TextField
            name="url"
            value={getMenuValue("url")}
            {...registerMenu("url", {
            })}
            fullWidth={true}
            error={!!menuErrors?.url}
            helperText={menuErrors?.url ? menuErrors.url.message : null}
          />
        </DialogFormat>
        <DialogFormat title={
          intl.formatMessage({
            id: 'page.menu.feature',
            defaultMessage: '功能',
          })
        } >
          <TextField
            name="feature"
            select
            value={getMenuValue("feature")}
            {...registerMenu("feature", {
              required: intl.formatMessage({
                id: 'error.required',
                defaultMessage: '必填欄位',
              })
            })}
            fullWidth={true}
            error={!!menuErrors?.feature}
            helperText={menuErrors?.feature ? menuErrors.feature.message : null}
          >
            {Object.keys(featureMap).map((value) => (
              <MenuItem key={value} value={value}>
                {
                  intl.formatMessage({
                    id: featureMap[value]["label"],
                    defaultMessage: '',
                  })
                }
              </MenuItem>
            ))
            }
          </TextField>
        </DialogFormat>
        <DialogFormat title={
          intl.formatMessage({
            id: 'page.status',
            defaultMessage: '狀態',
          })
        } >
          <Switch
            name="status"
            checked={Boolean(Number(getMenuValue("status")))}
            {...registerMenu("status", {
            })}
          />
        </DialogFormat>
        <DialogFormat title={
          intl.formatMessage({
            id: 'page.menu.parents',
            defaultMessage: '選單(父類別)',
          })
        } >
          <TextField
            name="parent"
            select
            value={getMenuValue("parent")}
            {...registerMenu("parent", {
              required: intl.formatMessage({
                id: 'error.required',
                defaultMessage: '必填欄位',
              }),
            })}
            fullWidth={true}
            error={!!menuErrors?.parent}
            helperText={menuErrors?.parent ? menuErrors.parent.message : null}
          >
            {(menuListMap.length > 0) &&
              menuListMap.map((value) => (
                (value.feature == "T" || value.feature == "P") &&
                <MenuItem key={value.id} value={value.id}>
                  {value.name}
                </MenuItem>
              ))
            }
          </TextField>
        </DialogFormat>
        <DialogFormat title={
          intl.formatMessage({
            id: 'page.weight',
            defaultMessage: '權重',
          })
        } >
          <TextField
            name="weight"
            type="number"
            value={Number(getMenuValue("weight"))}
            {...registerMenu("weight", {
              max: {
                value: 32766, message: intl.formatMessage({
                  id: 'error.max.length',
                  defaultMessage: '最大值為 {length}',
                }, { 'length': '32766' })
              }
            })}
            fullWidth={true}
            error={!!menuErrors?.weight}
            helperText={menuErrors?.weight ? menuErrors.weight.message : null}
          />
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
            value={getMenuValue("remark") ?? ""}
            {...registerMenu("remark", {})}
          />
        </DialogFormat>
      </Grid>
    </DataTableDialog>
  )
}