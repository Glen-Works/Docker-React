import { Grid, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import PageContent from 'src/components/PageContent';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useAuthStateContext } from 'src/contexts/AuthContext';


function SampleContent() {
  const theme = useTheme();
  let navigate = useNavigate();
  const { state } = useAuthStateContext();
  useEffect(() => {

  }, []);

  return (
    <>
      <Helmet>
        <title>Transactions - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          title={"SampleConetent"}
          subTitle={""}
        />
      </PageTitleWrapper>
      <PageContent
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"

        >
          <Grid item xs={12}>



          </Grid>
        </Grid>
      </PageContent>
      {/* <Footer /> */}
    </>
  );
}

export default SampleContent;
