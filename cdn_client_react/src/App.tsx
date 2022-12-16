import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import UseAuthState from 'src/contexts/AuthContext';
import UseAuthMenuState from './contexts/AuthMenuContext';
// import FontStyle from './theme/FontStyle';
import ThemeProvider from './theme/ThemeProvider';

function App() {
  const content = useRoutes(router);

  return (
    <ThemeProvider>
      {/* <FontStyle> */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <UseAuthState>
          <UseAuthMenuState>
            {content}
          </UseAuthMenuState>
        </UseAuthState>
      </LocalizationProvider>
      {/* </FontStyle> */}
    </ThemeProvider >
  );
}
export default App;
