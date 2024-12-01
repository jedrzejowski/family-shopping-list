import {FC} from "react";
import {productsRepo, shoppingListsOfProductsRepo, shoppingListsRepo} from "../../state/stdRepos.ts";
import PageContainer from "../../components/PageContainer.tsx";
import ProductEditForm from "../../components/forms/ProductEditForm.tsx";
import PageTitle from "../../components/PageTitle.tsx";
import {Divider, List, ListItemButton, Toolbar, Typography} from "@mui/material";
import QuerySkeleton from "../../components/query/QuerySkeleton.tsx";

const EditProductPage: FC<{
  productId: string;
}> = props => {
  const productQuery = productsRepo.useGetQuery(props.productId);
  const productMutation = productsRepo.useUpdateMutation();
  const shoppingListsQuery = shoppingListsOfProductsRepo.useSearchQuery({
    limit: Infinity,
    offset: 0,
    productId: props.productId,
  });

  if (productQuery.isPending) {
    return <div>Loading</div>
  }

  if (productQuery.isError) {
    return <div>Error</div>
  }

  return <PageContainer>

    <PageTitle title="Edycja produktu"/>

    <ProductEditForm
      product={productQuery.data}
      onSubmitChange={(data) => productMutation.mutate(data)}
    />

    <Divider/>

    <QuerySkeleton query={shoppingListsQuery} render={data => (
      data.totalCount === 0 ? (
        <Toolbar disableGutters>
          <Typography sx={{flexGrow: 1}}>Podany produkt nie jest na żadnej liście</Typography>
        </Toolbar>
      ) : <>
        <Toolbar disableGutters>
          <Typography sx={{flexGrow: 1}}>Podany produkt znajduje się na listach:</Typography>
        </Toolbar>
        <List>
          {data.items.map(shoppingListId => (
            <ListItemButton key={shoppingListId}>
              <shoppingListsRepo.Text shoppingListId={shoppingListId}/>
            </ListItemButton>
          ))}
        </List>
      </>
    )}/>

  </PageContainer>
};

export default EditProductPage;
