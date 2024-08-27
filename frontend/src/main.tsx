import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {
  createHashRouter, Outlet,
  RouterProvider, useParams,
} from "react-router-dom";
import ProductListPage from "./pages/products/ProductListPage.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import EditProductPage from "./pages/products/EditProductPage.tsx";
import MainAppLayout from "./components/MainAppLayout.tsx";
import CreateProductPage from "./pages/products/CreateProductPage.tsx";
import {MyThemeProvider} from "./mui-theme.tsx";
import {SnackbarProvider} from 'notistack';
import CreateShopPage from './pages/shops/CreateShopProduct.tsx';
import ShopListPage from "./pages/shops/ShopListPage.tsx";
import EditShopPage from "./pages/shops/EditShopPage.tsx";

const root = document.getElementById('root')!;
const reactRoot = createRoot(root);

const queryClient = new QueryClient();

const router = createHashRouter([
  {
    path: "",
    element: <>
      <MainAppLayout>
        <Outlet/>
      </MainAppLayout>
    </>,
    children: [
      {
        path: "products",
        Component: ProductListPage,
      },
      {
        path: "products/@new",
        Component: () => {
          return <CreateProductPage/>
        },
      },
      {
        path: "products/:productId",
        Component: () => {
          const {productId} = useParams<"productId">();
          return <EditProductPage productId={productId!}/>
        },
      },

      {
        path: "shops",
        Component: ShopListPage,
      },
      {
        path: "shops/@new",
        Component: () => {
          return <CreateShopPage/>
        },
      },
      {
        path: "shops/:shopsId",
        Component: () => {
          const {shopsId} = useParams<"shopsId">();
          return <EditShopPage shopId={shopsId!}/>
        },
      },
    ]
  },
]);

reactRoot.render(
  <StrictMode>
    <MyThemeProvider>
      <SnackbarProvider>

        <QueryClientProvider client={queryClient}>

          <RouterProvider router={router}/>

        </QueryClientProvider>
      </SnackbarProvider>
    </MyThemeProvider>
  </StrictMode>,
)
