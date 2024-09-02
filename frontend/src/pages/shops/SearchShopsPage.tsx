import {FC, useState} from "react";
import {useGetShopQuery, useSearchShopQuery} from "../../state/stdRepos.ts";
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


const SearchShopsPage: FC = () => {
  const navigate = useNavigate();
  const [searchQueryText, setSearchQueryText] = useState('');
  const shopListQuery = useSearchShopQuery({
    searchText: searchQueryText,
    limit: 10,
    offset: 0,
  });


  return <PageContainer>
    <PageTitle title="Produkty"/>

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

    {shopListQuery.isPending ? (
      <div>Loading</div>
    ) : shopListQuery.isError ? (
      <div>Error</div>
    ) : (
      <List>
        {shopListQuery.data.items.map(item => {
          return <ShopItem key={item} shopId={item}/>
        })}
      </List>
    )}

  </PageContainer>;
};

export default SearchShopsPage;

const ShopItem: FC<{ shopId: string }> = props => {
  const navigate = useNavigate();
  const shopQuery = useGetShopQuery(props.shopId);

  if (shopQuery.isPending) {
    return <div>Loading</div>
  }

  if (shopQuery.isError) {
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
        onClick={() => navigate(`./${props.shopId}`)}
        edge="end"
      >
        <EditIcon/>
      </IconButton>
    </>}
  >
    <ListItemText primary={shopQuery.data.brandName}/>
  </ListItem>
}
