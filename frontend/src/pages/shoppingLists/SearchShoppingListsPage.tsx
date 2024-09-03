import {FC} from "react";
import {useGetShoppingListQuery, useSearchShoppingListQuery} from "../../state/stdRepos.ts";
import {IconButton, ListItem, ListItemText, colors, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import PageContainer from "../../components/PageContainer.tsx";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PageTitle from "../../components/PageTitle.tsx";
import Searchable from "../../components/Searchable/Searchable.tsx";


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

  if (shoppingListQuery.isPending) {
    return <div>Loading</div>
  }

  if (shoppingListQuery.isError) {
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
        onClick={() => navigate(`./${props.shoppingListId}`)}
        edge="end"
      >
        <EditIcon/>
      </IconButton>
    </>}
  >
    <ListItemText primary={shoppingListQuery.data.name}/>
  </ListItem>
}
