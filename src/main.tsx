import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';

import './index.css';

// Import i18n configuration
import './configs/i18next';
import './configs/i18next/formatters';

import { ThemeProvider } from './components/theme/theme-provider';
import { AuthProvider } from './features/auth/contexts/auth.context';
import useAuth from './features/auth/hooks/use-auth';
import { router } from './router';

const queryClient = new QueryClient();

const InnerApp = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
};

const App = () => {
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <InnerApp />
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);

  // Enable HMR for development
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      root.render(<App />);
    });
  }
}
