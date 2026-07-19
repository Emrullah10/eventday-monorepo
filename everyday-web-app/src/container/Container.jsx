import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from '@shared/providers/ThemeProvider';
import NotificationProvider from '@shared/providers/NotificationProvider';
import QueryProvider from '@shared/providers/QueryProvider';
import AuthBootstrap from './AuthBootstrap';

const Container = ({ children }) => (
  <ThemeProvider>
    <NotificationProvider>
      <QueryProvider>
        <BrowserRouter>
          <AuthBootstrap>{children}</AuthBootstrap>
        </BrowserRouter>
      </QueryProvider>
    </NotificationProvider>
  </ThemeProvider>
);

export default Container;
