import { Box, Container, styled, Typography } from '@mui/material';

const FooterWrapper = styled(Container)(
  ({ theme }) => ``
);

function Footer() {
  return (
    <FooterWrapper sx={{ position: 'absolute' }}>
      <Box
        py={1}
        display={{ xs: 'block' }}
        alignItems="center"
        textAlign={{ xs: 'center' }}
        sx={{ alignContent: 'flex-end' }}
      >
        <Box alignItems="center">
          <Typography variant="subtitle1">
            &copy; 2022 - wvt Dashboard
          </Typography>
        </Box>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
