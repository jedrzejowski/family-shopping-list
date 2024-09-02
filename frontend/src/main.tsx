import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {
  createHashRouter, Outlet,
  RouterProvider, useParams,
} from "react-router-dom";
import SearchProductsPage from "./pages/products/SearchProductsPage.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import EditProductPage from "./pages/products/EditProductPage.tsx";
import MainAppLayout from "./components/MainAppLayout.tsx";
import CreateProductPage from "./pages/products/CreateProductPage.tsx";
import {MyThemeProvider} from "./mui-theme.tsx";
import {SnackbarProvider} from 'notistack';
import CreateShopPage from './pages/shops/CreateShopProduct.tsx';
import SearchShopsPage from "./pages/shops/SearchShopsPage.tsx";
import EditShopPage from "./pages/shops/EditShopPage.tsx";
import {LoadingShroudProvider} from "./LoadingShroud.tsx";
import CreateShoppingListPage from "./pages/shoppingLists/CreateShoppingList.tsx";
import EditShoppingListPage from "./pages/shoppingLists/EditShoppingListPage.tsx";
import SearchShoppingListsPage from "./pages/shoppingLists/SearchShoppingListsPage.tsx";
import CreateShoppingListItemPage from "./pages/shoppingListItems/CreateShoppingListItemPage.tsx";

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
          return <SearchShoppingListsPage/>
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
        path: "shopping-lists/:id/@newItem",
        Component: () => {
          const {id} = useParams<"id">();
          return <CreateShoppingListItemPage shoppingListId={id!}/>
        },
      },

      {
        path: "products",
        Component: SearchProductsPage,
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
        Component: SearchShopsPage,
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
