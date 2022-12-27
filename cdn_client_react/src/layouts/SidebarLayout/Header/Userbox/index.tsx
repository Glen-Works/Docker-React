import { useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Divider, lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';

import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/material/styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { logoutApi } from 'src/api/Header/Userbox/userboxApi';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import { logoutRemoveCookie } from 'src/stores/action/authActions';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  const navigate = useNavigate();
  const { state, dispatch } = useAuthStateContext();

  const user = {
    name: state.userInfo?.name ?? "",
    // avatar: '/static/images/avatars/1.jpg',
    // jobtitle: 'Project Manager'
  };

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleButton = (path: string): void => {
    handleClose();
    return navigate(path);
  }

  const logout = () => {
    logoutApi(state)?.then(res => {
      logoutRemoveCookie(dispatch);
      return navigate('/login');
    }).catch(error => {
      console.log("error:" + error.response?.data?.message);
    });
  }

  const intl = useIntl();

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        {/* <Avatar variant="rounded" alt={user.name} src={user.avatar} /> */}
        <Box>
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {/* {user.jobtitle} */}
            </UserBoxDescription>
          </UserBoxText>
        </Box>
        <Box>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Box>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          {/* <Avatar variant="rounded" alt={user.name} src={user.avatar} /> */}
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {/* {user.jobtitle} */}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <ListItem button onClick={() => handleButton("/user/profile")}>
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary={
              intl.formatMessage({
                id: 'header.profile',
                defaultMessage: '個人資訊',
              })
            } />
          </ListItem>
          {/* <ListItem button to="/dashboards/messenger" component={NavLink}>
            <InboxTwoToneIcon fontSize="small" />
            <ListItemText primary="Messenger" />
          </ListItem>
          <ListItem
            button
            to="/management/profile/settings"
            component={NavLink}
          >
            <AccountTreeTwoToneIcon fontSize="small" />
            <ListItemText primary="Account Settings" />
          </ListItem> */}
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={logout}>
            <LogoutIcon sx={{ mr: 1 }} />
            <FormattedMessage
              id="header.logout"
              defaultMessage="登出"
            />
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
