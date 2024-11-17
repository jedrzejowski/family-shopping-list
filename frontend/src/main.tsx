import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import {MyThemeProvider} from "./mui-theme.tsx";
import {SnackbarProvider} from 'notistack';
import {LoadingShroudProvider} from "./LoadingShroud.tsx";
import {router} from "./router.tsx";
import {FamilyIdProvider} from "./state/family.tsx";
import {PageActionsContextProvider} from "./components/PageActions.tsx";
import {ReactQueryProvider} from "./react-query.tsx";
// import {initServiceWorker} from "./service-worker/register.ts";

const root = document.getElementById('root')!;
const reactRoot = createRoot(root);

reactRoot.render(
  <StrictMode>
    <MyThemeProvider>
      <SnackbarProvider>
        <FamilyIdProvider>
          <ReactQueryProvider>
            <LoadingShroudProvider>
              <PageActionsContextProvider>

                <RouterProvider router={router}/>

              </PageActionsContextProvider>
            </LoadingShroudProvider>
          </ReactQueryProvider>
        </FamilyIdProvider>
      </SnackbarProvider>
    </MyThemeProvider>
  </StrictMode>,
)

// initServiceWorker()
