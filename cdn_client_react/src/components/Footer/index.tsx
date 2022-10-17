import { Box, Container, styled, Typography } from '@mui/material';

const FooterWrapper = styled(Container)(
  ({ theme }) => `
        margin-top: ${theme.spacing(4)};
`
);

function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        pb={4}
        display={{ xs: 'block' }}
        alignItems="center"
        textAlign={{ xs: 'center' }}
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
