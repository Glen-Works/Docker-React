import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Grid, TextField } from "@mui/material";
import { FormattedMessage, useIntl } from 'react-intl';

interface MenuSearchProp {
  checkFeatureCreate: boolean,
  register: any,
  handleSubmit: any,
  onFormSubmit: (formObj, event) => void,
  handleAddClickOpen: () => void,
}

export default function MenuSearch(props: MenuSearchProp) {
  const {
    checkFeatureCreate,
    register,
    handleSubmit,
    onFormSubmit,
    handleAddClickOpen,
  } = props;

  const intl = useIntl();

  return (
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
            label={
              intl.formatMessage({
                id: 'page.name',
                defaultMessage: '名稱',
              })
            }
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
            label={
              intl.formatMessage({
                id: 'page.menu.url',
                defaultMessage: '網址',
              })
            }
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
            <FormattedMessage
              id="page.search"
              defaultMessage="查詢"
            />
          </Button>
        </Grid>
        {
          (checkFeatureCreate) &&
          <Grid item >
            <Button
              variant="contained"
              color='warning'
              startIcon={<AddTwoToneIcon fontSize="small" />}
              onClick={handleAddClickOpen}
            >
              <FormattedMessage
                id="page.create"
                defaultMessage="新增"
              />
            </Button>
          </Grid>
        }
      </Grid>
    </Box>
  )
}