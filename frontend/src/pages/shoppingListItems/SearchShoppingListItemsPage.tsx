import {FC, ReactNode} from "react";
import {useNavigate} from "react-router-dom";
import PageContainer from "../../components/PageContainer.tsx";
import PageTitle from "../../components/PageTitle.tsx";
import {Button} from "@mui/material";
import {useShoppingListItemsQuery} from "../../state/shoppingList.tsx";
import {productsRepo, shoppingListItemsRepo, shoppingListsRepo} from "../../state/stdRepos.ts";
import SearchableItem from "../../components/Searchable/SearchableItem.tsx";
import PageActions from "../../components/PageActions.tsx";
import EditIcon from '@mui/icons-material/Edit';
import {useShoppingListItemIsCheckedMutation} from "../../state/shoppingListItem.ts";
import SearchableItemPlaceholder from "../../components/Searchable/SearchableItemPlaceholder.tsx";
import {useIsMobileLayout} from "../../mui-theme.tsx";
import ScrollableSearchable from "../../components/Searchable/ScrollableSearchable.tsx";
import PaginatedSearchable from "../../components/Searchable/PaginatedSearchable.tsx";

const SearchShoppingListItemsPage: FC<{
  shoppingListId: string;
}> = props => {
  const navigate = useNavigate();
  const shoppingListQuery = shoppingListsRepo.useGetQuery(props.shoppingListId)
  const isMobileLayout = useIsMobileLayout();

  const Searchable = isMobileLayout ? ScrollableSearchable : PaginatedSearchable;

  return <PageContainer>
    <PageTitle title={<>Listy zakupów / {shoppingListQuery.data?.name} / pozycje</>}/>

    <PageActions actions={[
      {
        icon: <EditIcon fontSize="small"/>,
        label: 'Edytuj listę',
        handler: () => navigate(`/shopping-lists/${props.shoppingListId}`)
      }
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
      initialPageSize={isMobileLayout ? Infinity : undefined}
    />

  </PageContainer>;
}

export default SearchShoppingListItemsPage

const ShoppingListItem: FC<{
  shoppingListItemId: string;
}> = props => {
  const navigate = useNavigate();
  const shoppingListQuery = shoppingListItemsRepo.useGetQuery(props.shoppingListItemId);
  const deleteUx = shoppingListItemsRepo.useDeleteUx(props.shoppingListItemId);
  const productQuery = productsRepo.useGetQuery(shoppingListQuery.data?.productId);
  const isCheckedMutation = useShoppingListItemIsCheckedMutation();

  if (!shoppingListQuery.isSuccess || (!shoppingListQuery.data.productName && !productQuery.isSuccess)) {
    return <SearchableItemPlaceholder/>;
  }

  let primaryText: ReactNode = null;
  if (shoppingListQuery.data.productName) primaryText = <i>{shoppingListQuery.data.productName}</i>;
  else if (productQuery.data?.tradeName) primaryText = productQuery.data.tradeName;

  return <>
    {deleteUx.dialog}
    <SearchableItem
      checkbox={shoppingListQuery.data.isChecked}
      primaryText={primaryText}
      primaryAction={() => {
        isCheckedMutation.mutate({
          shoppingListItemId: props.shoppingListItemId,
          isChecked: !shoppingListQuery.data.isChecked,
          updateSearch: true,
        })
      }}
      secondaryActions={[
        {icon: 'edit', label: 'Edytuj', handler: () => navigate(`/shopping-list-items/${props.shoppingListItemId}`)},
        {icon: 'delete', label: 'Usuń', handler: deleteUx.start}
      ]}
    />
  </>
}
