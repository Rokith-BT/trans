// import { Box, Flex, Text } from '@components'
import { ThemeProvider } from '@mui/material';
import { AuthProvider, RootRoutes } from './routes';
import { Layout } from '@templates';
import { themeOptions } from './material-ui.theme';
import ScrollToAnchor from './hooks/ScrollToAnchor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  ScrollToAnchor();
  return (
    <ThemeProvider theme={themeOptions}>
      <AuthProvider>
        <Layout>
          <RootRoutes />
        </Layout>
      </AuthProvider>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
