import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {MyThemeProvider} from "./mui-theme.tsx";
import {SnackbarProvider} from 'notistack';
import {LoadingShroudProvider} from "./LoadingShroud.tsx";
import {router} from "./router.tsx";
import {FamilyIdProvider} from "./state/family.tsx";
import {PageActionsContextProvider} from "./components/PageActions.tsx";

const root = document.getElementById('root')!;
const reactRoot = createRoot(root);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    }
  }
});

window.queryClient = queryClient;

reactRoot.render(
  <StrictMode>
    <MyThemeProvider>
      <SnackbarProvider>
        <FamilyIdProvider>
          <QueryClientProvider client={queryClient}>
            <LoadingShroudProvider>
              <PageActionsContextProvider>

                <RouterProvider router={router}/>

              </PageActionsContextProvider>
            </LoadingShroudProvider>
          </QueryClientProvider>
        </FamilyIdProvider>
      </SnackbarProvider>
    </MyThemeProvider>
  </StrictMode>,
)
