import { Container, Grid } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import DataTableThemeProvider from 'src/components/DataTableTheme';
import getTextLabels from 'src/components/DataTableTheme/TextLabels';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import PageHeader from './PageHeader';
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

  const options: MUIDataTableOptions = {
    search: false,
    print: false,
    filter: false,
    textLabels: getTextLabels()
  };

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
            <DataTableThemeProvider>
              <MUIDataTable
                title={"Employee List"}
                data={data}
                columns={columns}
                options={options}
              />
            </DataTableThemeProvider>
            <RecentOrders />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ApplicationsTransactions;
