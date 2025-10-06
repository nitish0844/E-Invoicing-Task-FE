import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "mantine-react-table/styles.css";
import "./App.css";

import { useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import requestInterceptor from "./api/requestInterceptor";
import responseInterceptor from "./api/responseInterceptor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { apiCallProtected } from "./api/axios";
import Login from "./pages/login/Login";
import useAuthStore from "./store/authStore";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { theme } from "./theme/theme";
import { Notifications } from "@mantine/notifications";
import Routing from "./Routing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  const { auth_token } = useAuthStore((state) => ({
    auth_token: state?.auth?.access_token,
  }));

  requestInterceptor();
  responseInterceptor();

  useEffect(() => {
    return () => {
      apiCallProtected.interceptors.request.eject(requestInterceptor);
      apiCallProtected.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Notifications position="top-right" zIndex={99999} limit={5} />
        <BrowserRouter>
          <Routes>
            {auth_token ? (
              <Route path="/*" element={<Routing />} />
            ) : (
              <Route path="/*" element={<Login />} />
            )}
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
