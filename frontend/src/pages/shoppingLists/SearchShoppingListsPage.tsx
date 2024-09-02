import {FC, useState} from "react";
import {useGetShoppingListQuery, useSearchShoppingListQuery} from "../../state/stdRepos.ts";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  colors,
  TextField,
  Toolbar,
  Box,
  Button,
  Divider
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import PageContainer from "../../components/PageContainer.tsx";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PageTitle from "../../components/PageTitle.tsx";


const SearchShoppingListsPage: FC = () => {
  const navigate = useNavigate();
  const [searchQueryText, setSearchQueryText] = useState('');
  const shoppingListListQuery = useSearchShoppingListQuery({
    searchText: searchQueryText,
    limit: 10,
    offset: 0,
  });


  return <PageContainer>
    <PageTitle title="Listy zakupów"/>

    <Toolbar sx={{display: 'flex'}} disableGutters>
      <TextField
        label="Szukaj"
        value={searchQueryText}
        onChange={event => setSearchQueryText(event.target.value)}
      />

      <Box sx={{flex: 1}}>

      </Box>

      <Button
        variant="contained"
        onClick={() => navigate('./@new')}
      >
        Dodaj
      </Button>

    </Toolbar>

    <Divider sx={{mt: 1}}/>

    {shoppingListListQuery.isPending ? (
      <div>Loading</div>
    ) : shoppingListListQuery.isError ? (
      <div>Error</div>
    ) : (
      <List>
        {shoppingListListQuery.data.items.map(item => {
          return <ShoppingListItem key={item} shoppingListId={item}/>
        })}
      </List>
    )}

  </PageContainer>;
};

export default SearchShoppingListsPage;

const ShoppingListItem: FC<{ shoppingListId: string }> = props => {
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
