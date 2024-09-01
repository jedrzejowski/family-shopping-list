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
import {LoadingShroudProvider} from "./LoadingShroud.tsx";
import CreateShoppingListPage from "./pages/shoppingLists/CreateShoppingList.tsx";
import EditShoppingListPage from "./pages/shoppingLists/EditShoppingListPage.tsx";
import ShoppingListListPage from "./pages/shoppingLists/ShoppingListListPage.tsx";

const root = document.getElementById('root')!;
const reactRoot = createRoot(root);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000
    }
  }
});

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
        path: "shopping-lists",
        Component: () => {
          return <ShoppingListListPage/>
        },
      },
      {
        path: "shopping-lists/@new",
        Component: () => {
          return <CreateShoppingListPage/>
        },
      },
      {
        path: "shopping-lists/:id",
        Component: () => {
          const {id} = useParams<"id">();
          return <EditShoppingListPage shoppingListId={id!}/>
        },
      },

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
        path: "products/:id",
        Component: () => {
          const {id} = useParams<"id">();
          return <EditProductPage productId={id!}/>
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
          <LoadingShroudProvider>

            <RouterProvider router={router}/>

          </LoadingShroudProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </MyThemeProvider>
  </StrictMode>,
)
