import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import UseAuthState from 'src/contexts/AuthContext';
import UseAuthMenuState from './contexts/AuthMenuContext';
import ThemeProvider from './theme/ThemeProvider';

function App() {
  const content = useRoutes(router);

  return (

    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <UseAuthState>
          <UseAuthMenuState>
            {content}
          </UseAuthMenuState>
        </UseAuthState>
      </LocalizationProvider>
    </ThemeProvider>

  );
}
export default App;
