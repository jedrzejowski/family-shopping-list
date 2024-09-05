import {FC} from "react";
import {useNavigate} from "react-router-dom";
import PageContainer from "../../components/PageContainer.tsx";
import PageTitle from "../../components/PageTitle.tsx";
import Searchable from "../../components/Searchable/Searchable.tsx";
import {Button} from "@mui/material";
import {useShoppingListItemsQuery} from "../../state/shoppingList.tsx";
import {
  useDeleteShoppingListItemUx,
  useGetProductQuery,
  useGetShoppingListItemQuery,
  useGetShoppingListQuery
} from "../../state/stdRepos.ts";
import SearchableItem from "../../components/Searchable/SearchableItem.tsx";
import PageActions from "../../components/PageActions.tsx";
import EditIcon from '@mui/icons-material/Edit';

const SearchShoppingListItemsPage: FC<{
  shoppingListId: string;
}> = props => {
  const navigate = useNavigate();
  const shoppingListQuery = useGetShoppingListQuery(props.shoppingListId)

  return <PageContainer>
    <PageTitle title={<>Lista <i>{shoppingListQuery.data?.name}</i> - pozycje</>} />

    <PageActions actions={[
      {icon: <EditIcon fontSize="small"/>, label: 'Edytuj listę', handler: () => navigate(`/shopping-lists/${props.shoppingListId}`)}
    ]}/>

    <Searchable
      useSearchQuery={useShoppingListItemsQuery}
      additionalSearchQueryProps={{shoppingListId: props.shoppingListId}}
      renderItem={id => <ShoppingListItem key={id} shoppingListItemId={id}/>}
      toolbarActions={<>
        <Button
          variant="contained"
          onClick={() => navigate(`/shopping-lists/${props.shoppingListId}/@new-item`)}
        >
          Dodaj
        </Button>
      </>}
    />

  </PageContainer>;
}

export default SearchShoppingListItemsPage

const ShoppingListItem: FC<{
  shoppingListItemId: string;
}> = props => {
  const navigate = useNavigate();
  const shoppingListQuery = useGetShoppingListItemQuery(props.shoppingListItemId);
  const deleteUx = useDeleteShoppingListItemUx(props.shoppingListItemId);
  const productQuery = useGetProductQuery(shoppingListQuery.data?.productId);

  if (shoppingListQuery.isPending || productQuery.isPending) {
    return <div>Loading</div>
  }

  if (shoppingListQuery.isError || productQuery.isError) {
    return <div>Error</div>
  }


  return <>
    {deleteUx.dialog}
    <SearchableItem
      primaryText={productQuery.data.tradeName}
      primaryAction={() => navigate(`/shopping-list-items/${props.shoppingListItemId}`)}
      secondaryActions={[
        {icon: 'delete', label: 'Usuń', handler: deleteUx.start}
      ]}
    />
  </>
}
