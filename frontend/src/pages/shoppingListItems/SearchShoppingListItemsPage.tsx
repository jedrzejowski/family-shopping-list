import {FC} from "react";
import {useNavigate} from "react-router-dom";
import PageContainer from "../../components/PageContainer.tsx";
import PageTitle from "../../components/PageTitle.tsx";
import Searchable from "../../components/Searchable.tsx";
import {Button, colors, IconButton, ListItem, ListItemText} from "@mui/material";
import {useShoppingListItemsQuery} from "../../state/shoppingList.tsx";
import {useGetProductQuery, useGetShoppingListItemQuery} from "../../state/stdRepos.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const SearchShoppingListItemsPage: FC<{
  shoppingListId: string;
}> = props => {
  const navigate = useNavigate();

  return <PageContainer>
    <PageTitle title="Pozycje listy zakupowej"/>

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
  const productQuery = useGetProductQuery(shoppingListQuery.data?.productId);

  if (shoppingListQuery.isPending || productQuery.isPending) {
    return <div>Loading</div>
  }

  if (shoppingListQuery.isError || productQuery.isError) {
    return <div>Error</div>
  }

  return <ListItem
    sx={{
      pr: (16 + 40 * 2) + 'px',
      '&:hover': {
        background: theme => theme.palette.action.hover,
      }
    }}
    secondaryAction={<>
      <IconButton>
        <DeleteIcon sx={{color: colors.red[500]}}/>
      </IconButton>
      <IconButton
        onClick={() => navigate(`/shopping-list-items/${props.shoppingListItemId}`)}
        edge="end"
      >
        <EditIcon/>
      </IconButton>
    </>}
  >
    <ListItemText primary={productQuery.data.tradeName}/>
  </ListItem>
}
