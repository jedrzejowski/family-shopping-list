import {createHashRouter, Outlet, RouteObject, useParams} from "react-router-dom";
import MainAppLayout from "./components/MainAppLayout.tsx";
import SearchShoppingListsPage from "./pages/shoppingLists/SearchShoppingListsPage.tsx";
import CreateShoppingListPage from "./pages/shoppingLists/CreateShoppingList.tsx";
import EditShoppingListPage from "./pages/shoppingLists/EditShoppingListPage.tsx";
import CreateShoppingListItemPage from "./pages/shoppingListItems/CreateShoppingListItemPage.tsx";
import SearchShoppingListItemsPage from "./pages/shoppingListItems/SearchShoppingListItemsPage.tsx";
import SearchProductsPage from "./pages/products/SearchProductsPage.tsx";
import CreateProductPage from "./pages/products/CreateProductPage.tsx";
import EditProductPage from "./pages/products/EditProductPage.tsx";
import SearchShopsPage from "./pages/shops/SearchShopsPage.tsx";
import CreateShopPage from "./pages/shops/CreateShopProduct.tsx";
import EditShopPage from "./pages/shops/EditShopPage.tsx";
import EditShoppingListItemPage from "./pages/shoppingListItems/EditShoppingListItemPage.tsx";

const routes: RouteObject[] = [
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
        path: "shopping-lists/:id/@new-item",
        Component: () => {
          const {id} = useParams<"id">();
          return <CreateShoppingListItemPage shoppingListId={id!}/>
        },
      },
      {
        path: "shopping-lists/:id/items",
        Component: () => {
          const {id} = useParams<"id">();
          return <SearchShoppingListItemsPage shoppingListId={id!}/>
        },
      },


      {
        path: "shopping-list-items/:id",
        Component: () => {
          const {id} = useParams<"id">();
          return <EditShoppingListItemPage shoppingListItemId={id!}/>
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
];

export const router = createHashRouter(routes);
