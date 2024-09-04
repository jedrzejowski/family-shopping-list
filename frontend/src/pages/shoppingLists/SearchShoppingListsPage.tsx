import {FC} from "react";
import {useDeleteShoppingListUx, useGetShoppingListQuery, useSearchShoppingListQuery} from "../../state/stdRepos.ts";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import PageContainer from "../../components/PageContainer.tsx";
import PageTitle from "../../components/PageTitle.tsx";
import Searchable from "../../components/Searchable/Searchable.tsx";
import SearchableItem from "../../components/Searchable/SearchableItem.tsx";


const SearchShoppingListsPage: FC = () => {
  const navigate = useNavigate();

  return <PageContainer>
    <PageTitle title="Listy zakupów"/>

    <Searchable
      useSearchQuery={useSearchShoppingListQuery}
      renderItem={shoppingListId => <ShoppingList key={shoppingListId} shoppingListId={shoppingListId}/>}
      toolbarActions={<>
        <Button
          variant="contained"
          onClick={() => navigate('./@new')}
        >
          Dodaj
        </Button>
      </>}
    />

  </PageContainer>;
};

export default SearchShoppingListsPage;

const ShoppingList: FC<{ shoppingListId: string }> = props => {
  const navigate = useNavigate();
  const shoppingListQuery = useGetShoppingListQuery(props.shoppingListId);
  const deleteUx = useDeleteShoppingListUx(props.shoppingListId);

  if (shoppingListQuery.isPending) {
    return <div>Loading</div>
  }

  if (shoppingListQuery.isError) {
    return <div>Error</div>
  }

  return <>
    {deleteUx.dialog}
    <SearchableItem
      primaryText={shoppingListQuery.data.name}
      primaryAction={() => navigate(`./${props.shoppingListId}/items`)}
      secondaryActions={[
        {icon: 'delete', label: 'Usuń', handler: deleteUx.start}
      ]}
    />
  </>
}
