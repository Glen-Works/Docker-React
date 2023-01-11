import EditIcon from '@mui/icons-material/Edit';
import KeyTwoToneIcon from '@mui/icons-material/KeyTwoTone';
import { Grid, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { userProfileInfoApi, userUpdateProfileApi, userUpdateProfilePasswordApi } from 'src/api/Client/UserProfile/userProfileApi';
import { ColumnIconButton } from 'src/components/DataTable/CustomerIconRender';
import DialogFormat from "src/components/Dialog/DialogFormat";
import PageContent from 'src/components/PageContent';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Title from 'src/components/Title';
import { useAlertContext } from "src/contexts/AlertContext";
import { useAuthStateContext } from 'src/contexts/AuthContext';
import { notifyError, notifySuccess } from 'src/utils/notificationFunction';
import ProfileEditDialog from './ProfileEditDialog';
import ProfileEditPasswordDialog from './ProfileEditPasswordDialog';

interface ProfileData {
  name: string,
  email: string,
}

interface UserPassword {
  newPassword: string,
  checkPassword: string,
}

function UserProfile() {
  const intl = useIntl();
  const { actions } = useAlertContext();
  const theme = useTheme();
  const { state } = useAuthStateContext();

  const onError = (errors, e) => console.log(errors, e);
  const [editPasswordOpen, setEditPwdOpen] = useState<boolean>(false);
  const [editProfileOpen, setEditProfileOpen] = useState<boolean>(false);

  const { register: registerProfile, handleSubmit: handleSubmitProfile, setValue: setProfileValue, getValues: getProfileValue,
    watch: watchProfile, reset: resetProfile, formState: { errors: ProfileErrors } } = useForm(
      {
        defaultValues: {
          name: "",
          email: "",
        }
      }
    );

  const { register: registerPwd, handleSubmit: handleSubmitPwd, getValues: getPwdValue,
    watch: watchPwd, reset: resetPwd, formState: { errors: pwdErrors } } = useForm(
      {
        defaultValues: {
          password: "",
          passwordCheck: "",
        }
      });

  useEffect(() => { }, [watchProfile(), watchPwd()]);

  useEffect(() => {
    getData();
  }, []);

  const handleEditPwdOpen = () => {
    setEditPwdOpen(true);
  };

  const handleEditProfileOpen = () => {
    getData().then(() => { setEditProfileOpen(true) });
  };

  const handleEditPwdClose = () => {
    setEditPwdOpen(false);
    resetPwd();
  };

  const handleEditProfileClose = () => {
    setEditProfileOpen(false);
  };


  function getDialogProfileData(): ProfileData {
    var profileData: ProfileData = {
      name: getProfileValue("name"),
      email: getProfileValue("email")
    }
    return profileData;
  }

  const submitEditPwd = (formObj, event) => {
    var userPwd: UserPassword = {
      newPassword: getPwdValue("password"),
      checkPassword: getPwdValue("password"),
    }

    // console.log(userPwd);
    editProfilePwd(userPwd);
  };

  const submitEditProfile = (formObj, event) => {
    var data = getDialogProfileData();

    // console.log(userPwd);
    editUserProfile(data);
  };

  async function getData() {
    await userProfileInfoApi(state)
      .then(res => {
        let data = res.data.userInfo;
        setProfileValue("name", data.name, { shouldValidate: true });
        setProfileValue("email", data.email, { shouldValidate: true });
      })
      .catch(error => {
        notifyError(intl, actions, error.response?.data?.message);
        //console.log("error:" + error.response?.data?.message);
      });
  }

  function editUserProfile(data: any) {
    // console.log(data);
    userUpdateProfileApi(data, state)
      .then(res => {
        let notifyMsg = intl.formatMessage({
          id: 'response.update.success',
          defaultMessage: '修改成功',
        })
        notifySuccess(intl, actions, notifyMsg);
        handleEditProfileClose();
        getData()
      })
      .catch(error => {
        notifyError(intl, actions, error.response?.data?.message);
        //console.log("error:" + error.response?.data?.message);
      });
  }

  function editProfilePwd(data: any) {
    // console.log(data);
    userUpdateProfilePasswordApi(data, state)
      .then(res => {
        let notifyMsg = intl.formatMessage({
          id: 'response.update.success',
          defaultMessage: '修改成功',
        })
        notifySuccess(intl, actions, notifyMsg);
        handleEditPwdClose();
      })
      .catch(error => {
        notifyError(intl, actions, error.response?.data?.message);
        //console.log("error:" + error.response?.data?.message);
      });
  }

  return (
    <>
      <Title />
      <PageTitleWrapper>
        <PageHeader
          title={
            intl.formatMessage({
              id: 'header.profile',
              defaultMessage: '個人設定',
            })
          }
          subTitle={""}
        />
      </PageTitleWrapper>
      <PageContent>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"

          height={542}
        >
          <Grid item xs={12}>

            <Grid container justifyContent="center" alignItems="center" direction="column" >
              <Grid container justifyContent="flex-end" alignItems="center" direction="row" >
                <Grid item xs={3} >

                  <ColumnIconButton
                    title={
                      intl.formatMessage({
                        id: 'header.page.profile.update',
                        defaultMessage: '資料修改',
                      })
                    }
                    handleClickOpen={handleEditProfileOpen}
                    color={theme.palette.info.main}
                    background={theme.colors.error.lighter}
                  >
                    <EditIcon fontSize="small" sx={{ mr: '0.3em' }} />
                    <Typography color={theme.colors.alpha.black[100]}>
                      <FormattedMessage
                        id="header.page.profile.update"
                        defaultMessage="資料修改"
                      />
                    </Typography>
                  </ColumnIconButton>

                  <ColumnIconButton
                    title={
                      intl.formatMessage({
                        id: 'header.page.profile.password.update',
                        defaultMessage: '密碼修改',
                      })
                    }
                    handleClickOpen={handleEditPwdOpen}
                    color={theme.palette.error.main}
                    background={theme.colors.error.lighter}
                  >
                    <KeyTwoToneIcon fontSize="small" sx={{ mr: '0.3em' }} />
                    <Typography color={theme.colors.alpha.black[100]}>
                      <FormattedMessage
                        id="header.page.profile.password.update"
                        defaultMessage="密碼修改"
                      />
                    </Typography>
                  </ColumnIconButton>
                </Grid>
              </Grid>

              <DialogFormat
                title={
                  intl.formatMessage({
                    id: 'header.page.profile.name',
                    defaultMessage: '名稱',
                  })
                } >
                <Typography variant="h5" textAlign="left">{getProfileValue("name")}</Typography>
              </DialogFormat>
              <DialogFormat
                title={
                  intl.formatMessage({
                    id: 'header.page.profile.email',
                    defaultMessage: '信箱',
                  })
                }>
                <Typography variant="h5" textAlign="left">{getProfileValue("email")}</Typography>
              </DialogFormat>

              <ProfileEditDialog
                isOpen={editProfileOpen}
                handleClose={handleEditProfileClose}
                submitEdit={submitEditProfile}
                onError={onError}
                register={registerProfile}
                handleSubmit={handleSubmitProfile}
                getValue={getProfileValue}
                errors={ProfileErrors}
              />

              <ProfileEditPasswordDialog
                editPasswordOpen={editPasswordOpen}
                handleEditPwdClose={handleEditPwdClose}
                submitEditPwd={submitEditPwd}
                onError={onError}
                registerPwd={registerPwd}
                handleSubmitPwd={handleSubmitPwd}
                watchPwd={watchPwd}
                pwdErrors={pwdErrors}
              />

            </Grid>
          </Grid>
        </Grid>
      </PageContent>
      {/* <Footer /> */}
    </>
  );
}

export default UserProfile;
