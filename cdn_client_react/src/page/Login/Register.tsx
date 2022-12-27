import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import useCountDown from 'react-countdown-hook';
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from "react-router-dom";
import { registerApi, registerValidApi } from 'src/api/Login/RegisterApi';
import { validEmail } from 'src/utils/baseFunction';

interface RegisgerInfo {
  name: string,
  account: string,
  validation: string
  password: string,
}

export default function Register() {
  const intl = useIntl();
  const navigate = useNavigate();

  const initialTime = 10 * 1000; // initial time in milliseconds, defaults to 60000
  const interval = 1000; // interval to change remaining time amount, defaults to 1000
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, interval)

  const [stopSendEmail, setStopSendEmail] = useState<boolean>(false);
  const [validMessage, setValidMessage] = useState<string>("");

  const { register, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm(
    {
      defaultValues: {
        name: "",
        account: "",
        validCode: "",
        password: "",
      }
    });

  useEffect(() => { }, [watch()]);

  useEffect(() => {
    if (timeLeft == 0) setStopSendEmail(false);
  }, [timeLeft]);

  //login submit 
  const onFormSubmit = (formObj, event) => {
    var regisgerInfo: RegisgerInfo = {
      name: getValues("name"),
      account: getValues("account"),
      validation: getValues("validCode"),
      password: getValues("password"),
    }

    registerApi(regisgerInfo)?.then(res => {
      //註冊成功
      return navigate("/login");
    }).catch(error => {
      console.log("error:" + error.response?.msg);
    });
  };

  const validCode = () => {
    const account = getValues("account");
    if (!validEmail(account)) {
      setValidMessage(
        intl.formatMessage({
          id: 'error.email.format',
          defaultMessage: '信箱格式錯誤',
        })
      );
      return;
    }

    registerValidApi(account)?.then(res => {
      console.log(res.data);
    }).catch(error => {
      console.log("error:" + error.response?.data?.message);
    });
    start();
    setStopSendEmail(true);
    setValidMessage("");
  }

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        <FormattedMessage
          id="page.register.title"
          defaultMessage="註冊帳號"
        />
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          id="name"
          name="name"
          label={
            intl.formatMessage({
              id: 'page.login.name',
              defaultMessage: '名稱',
            })
          }
          {...register("name", {
            required: intl.formatMessage({
              id: 'error.required',
              defaultMessage: '必填欄位',
            }),
          })}
          error={!!errors?.name}
          helperText={errors?.name ? errors.name.message : null}
        />
        <TextField
          margin="normal"
          fullWidth
          id="account"
          name="account"
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
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          sx={{ ml: 0, mt: 0 }}
        >
          <Button
            variant="text"
            onClick={validCode}
            disabled={stopSendEmail}
          >
            <FormattedMessage
              id="page.login.valid.code.send"
              defaultMessage="寄送驗證碼"
            />
          </Button>
          {(timeLeft > 0)
            ? intl.formatMessage({
              id: 'page.login.valid.waitting.time',
              defaultMessage: '等待，重新發送 {second} 秒',
            }, { 'second': timeLeft / 1000 })
            : ""}
          {validMessage}
        </Grid>

        <TextField
          margin="normal"
          fullWidth
          name="validCode"
          id="validCode"
          label={
            intl.formatMessage({
              id: 'page.login.valid.code',
              defaultMessage: '驗證碼',
            })
          }
          {...register("validCode", {
            required: intl.formatMessage({
              id: 'error.required',
              defaultMessage: '必填欄位',
            }),
          })}
          error={!!errors?.validCode}
          helperText={errors?.validCode ? errors.validCode.message : null}
        />
        <TextField
          margin="normal"
          fullWidth
          name="password"
          type="password"
          id="password"
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          <FormattedMessage
            id="page.register.register"
            defaultMessage="註冊"
          />
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="/login" variant="body2">
              <FormattedMessage
                id="page.login.link"
                defaultMessage="回登入頁"
              />
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

