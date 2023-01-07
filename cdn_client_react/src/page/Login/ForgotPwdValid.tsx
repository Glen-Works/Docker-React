import { Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import useCountDown from 'react-countdown-hook';
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from 'react-intl';
import { forgotPwdValidApi } from 'src/api/Login/ForgotPwdApi';
import { validEmail } from 'src/utils/baseFunction';
export default function ForgotPwdValid() {
  const intl = useIntl();
  const url = window.location.href;
  const theme = useTheme();

  const initialTime = 30 * 1000; // initial time in milliseconds, defaults to 60000
  const interval = 1000; // interval to change remaining time amount, defaults to 1000
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, interval)

  const [stopSendEmail, setStopSendEmail] = useState<boolean>(false);
  const [validMessage, setValidMessage] = useState<string>("");

  const { register, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm(
    {
      defaultValues: {
        account: "",
      }
    });

  useEffect(() => { }, [watch()]);

  useEffect(() => {
    if (timeLeft == 0) setStopSendEmail(false);
  }, [timeLeft]);

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

    forgotPwdValidApi({ "url": url }, account)?.then(res => {
      console.log(res.data);
      start();
      setStopSendEmail(true);
    }).catch(error => {
      console.log("error:" + error.response?.data?.message);
      reset();
    });
    setValidMessage("");
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 1
      }}
    >
      <Typography component="h1" variant="h4">
        <FormattedMessage
          id="page.password.forgot"
          defaultMessage="忘記密碼"
        />
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1, width: '84%', maxWidth: '559px' }}>
        <TextField
          margin="normal"
          id="account"
          name="account"
          fullWidth
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
            ? <Box
              component="span"
              sx={{ color: theme.colors.error.main }}
            >
              {intl.formatMessage({
                id: 'page.login.valid.waitting.time',
                defaultMessage: '等待，重新發送 {second} 秒',
              }, { 'second': timeLeft / 1000 })}
            </Box>
            : ""}
          <Box
            component="span"
            sx={{ color: theme.colors.error.main }}
          >
            {validMessage}
          </Box>
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <Grid item xs>
            <Link href="/login" variant="body2">
              <FormattedMessage
                id="page.login.link"
                defaultMessage="回登入頁"
              />
            </Link>
          </Grid>
          <Grid item >
            <Link href="/forgot/password" variant="body2">
              <FormattedMessage
                id="page.login.password.forgot"
                defaultMessage="忘記密碼"
              />
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

