import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';

import './index.css';

// Import i18n configuration
import './configs/i18next';
import './configs/i18next/formatters';
// Import the generated route tree
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient();
const publicPath = import.meta.env.VITE_PUBLIC_PATH as string;

// Create a new router instance
const router = createRouter({ basepath: publicPath, routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </StrictMode>
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
