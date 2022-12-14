import { Grid, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContent from 'src/components/PageContent';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Title from 'src/components/Title';
import { useAuthStateContext } from 'src/contexts/AuthContext';


function SampleContent() {
  const theme = useTheme();
  let navigate = useNavigate();
  const { state } = useAuthStateContext();
  useEffect(() => {

  }, []);

  return (
    <>
      <Title />
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
