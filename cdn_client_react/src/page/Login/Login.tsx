import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { loginApi } from 'src/api/Login/loginApi';
import { useAlertContext } from "src/contexts/AlertContext";
import { useAuthStateContext } from 'src/contexts/AuthContext';
import { jwtValidate } from 'src/middleware/jwtAuthMiddleware';
import setUserInfo from 'src/stores/action/authActions';
import { notifyError } from 'src/utils/notificationFunction';

interface LoginInfo {
  account: string,
  password: string,
  remember: string
}

// todo 記得密碼、註冊
const COOKIE_USER_ACCOUNT_REMEMBER = "USER_ACCOUNT_REMEMBER";

export default function Login() {
  const intl = useIntl();
  const { actions } = useAlertContext();

  const navigate = useNavigate();
  const { state, dispatch } = useAuthStateContext();
  const { register, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm(
    {
      defaultValues: {
        account: "",
        password: "",
        remember: "",
      }
    });

  useEffect(() => {
    const fetchData = async () => {
      if (state?.authorisation?.accessToken == undefined || state?.authorisation?.accessToken == null) {

        return;
      }
      //判斷 是否已登入
      const check = await jwtValidate(state);
      if (check == true) {
        navigate('/dashboard');
      }
    };

    fetchData().then(async () => {
      //從Storage 提取帳密與狀態
      const data = secureLocalStorage.getItem(COOKIE_USER_ACCOUNT_REMEMBER);
      if (typeof data === "object" && data != null) {
        setValue("account", data["account"]);
        setValue("password", data["password"]);
        setValue("remember", data["remember"]);
      }
    });
  }, []);

  useEffect(() => { }, [watch()]);

  //login submit 
  const onFormSubmit = (formObj, event) => {
    var loginData: LoginInfo = {
      account: getValues("account"),
      password: getValues("password"),
      remember: getValues("remember"),
    }

    if (loginData.remember != "remember") {
      secureLocalStorage.removeItem(COOKIE_USER_ACCOUNT_REMEMBER);
    } else {
      secureLocalStorage.setItem(COOKIE_USER_ACCOUNT_REMEMBER, loginData);
    }

    loginApi(loginData)?.then(res => {
      setUserInfo(dispatch, res.data);
      return navigate("/dashboard");
    }).catch(error => {
      notifyError(intl, actions, error.response?.data?.message);
      console.log("error:" + error.response?.data?.message);
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 1
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'background.main', width: 85, height: 85 }}>
        <PersonOutlineIcon sx={{ m: 1, width: 60, height: 60 }} />
      </Avatar>
      <Typography component="h1" variant="h4">
        <FormattedMessage
          id="page.login.login"
          defaultMessage="登入"
        />
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 1, width: '84%', maxWidth: '559px' }}>
        <TextField
          margin="normal"
          fullWidth
          id="account"
          value={getValues("account")}
          name="account"
          // autoComplete="account"
          label={
            intl.formatMessage({
              id: 'page.login.account',
              defaultMessage: '帳號 (信箱)',
            })
          }
          {...register("account", {
            required: intl.formatMessage({
              id: 'error.required',
              defaultMessage: '必填欄位',
            }),
            minLength: {
              value: 5, message: intl.formatMessage({
                id: 'error.min.length',
                defaultMessage: '至少 {length} 字',
              }, { 'length': '5' })
            },
            maxLength: {
              value: 100, message: intl.formatMessage({
                id: 'error.max.length',
                defaultMessage: '最多 {length} 字',
              }, { 'length': '100' })
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9._]+\.[A-Z]{2,}$/i,
              message: intl.formatMessage({
                id: 'error.email.format',
                defaultMessage: '信箱格式錯誤',
              })
            }
          })}
          error={!!errors?.account}
          helperText={errors?.account ? errors.account.message : null}
        />
        <TextField
          margin="normal"
          fullWidth
          name="password"
          type="password"
          id="password"
          value={getValues("password")}
          // autoComplete="current-password"
          label={
            intl.formatMessage({
              id: 'page.login.password',
              defaultMessage: '密碼',
            })
          }
          {...register("password", {
            required: intl.formatMessage({
              id: 'error.required',
              defaultMessage: '必填欄位',
            }),
            minLength: {
              value: 5, message: intl.formatMessage({
                id: 'error.min.length',
                defaultMessage: '至少 {length} 字',
              }, { 'length': '5' })
            },
            maxLength: {
              value: 100, message: intl.formatMessage({
                id: 'error.max.length',
                defaultMessage: '最多 {length} 字',
              }, { 'length': '100' })
            },
          })}
          error={!!errors?.password}
          helperText={errors?.password ? errors.password.message : null}
        />
        <FormControlLabel
          control={
            <Checkbox
              key="remember"
              value="remember"
              color="primary"
              checked={getValues("remember") == "remember"}
              {...register("remember", {
              })}
            />}
          label={
            intl.formatMessage({
              id: 'page.login.password.remember',
              defaultMessage: '記住帳號密碼',
            })
          }
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          <FormattedMessage
            id="page.login.login"
            defaultMessage="登入"
          />
        </Button>
        <Grid container sx={{ mt: 1 }}>
          <Grid item xs>
            <Link href="/forgot/password" variant="body2">
              <FormattedMessage
                id="page.login.password.forgot"
                defaultMessage="忘記密碼"
              />
            </Link>
          </Grid>
          <Grid item>
            <Link href="/register" variant="body2">
              <FormattedMessage
                id="page.login.register.link"
                defaultMessage="目前無帳號，註冊"
              />
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

