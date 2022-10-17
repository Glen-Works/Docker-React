import { Container, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import PageHeader from './PageHeader';

import MUIDataTable from "mui-datatables";

import createCache from "@emotion/cache";
import RecentOrders from './RecentOrders';

function ApplicationsTransactions() {

  let navigate = useNavigate();
  const { state } = useAuthStateContext();
  useEffect(() => {

  }, []);

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "company",
      label: "Company",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "city",
      label: "City",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "state",
      label: "State",
      options: {
        filter: true,
        sort: true,
      }
    },
  ];

  const data = [
    { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
    { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
    { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
    { name: "James Houston", company: "Test Corp", city: "Dallas", state: "TX" },
  ];

  const options = {
    filterType: 'checkbox',
    sort: true,
  };

  const muiCache = createCache({
    "key": "mui",
    "prepend": true
  });

  return (
    <>
      <Helmet>
        <title>Transactions - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth={false} >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            {/* <CacheProvider value={muiCache}> */}
            <ThemeProvider theme={createTheme()}>
              <MUIDataTable
                title={"Employee List"}
                data={data}
                columns={columns}
                options={options}
              />
            </ThemeProvider>
            {/* </CacheProvider> */}
            <RecentOrders />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ApplicationsTransactions;
