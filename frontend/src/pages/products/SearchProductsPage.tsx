import {FC, useState} from "react";
import {useGetProductQuery, useSearchProductQuery} from "../../state/stdRepos.ts";
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
import Searchable from "../../components/Searchable.tsx";


const SearchProductsPage: FC = () => {
  const navigate = useNavigate();
  // const [searchQueryText, setSearchQueryText] = useState('');
  // const productListQuery = useSearchProductQuery({
  //   searchText: searchQueryText,
  //   limit: 10,
  //   offset: 0,
  // });


  return <PageContainer>
    <PageTitle title="Produkty"/>

    <Searchable
      useSearchQuery={useSearchProductQuery}
      renderItem={productId => <ProductItem key={productId} productId={productId}/>}
      toolbarActions={<>
        <Button
          variant="contained"
          onClick={() => navigate('./@new')}
        >
          Dodaj
        </Button>
      </>}
    />

    {/*<Toolbar sx={{display: 'flex'}} disableGutters>*/}
    {/*  <TextField*/}
    {/*    label="Szukaj"*/}
    {/*    value={searchQueryText}*/}
    {/*    onChange={event => setSearchQueryText(event.target.value)}*/}
    {/*  />*/}

    {/*  <Box sx={{flex: 1}}>*/}

    {/*  </Box>*/}

    {/*  <Button*/}
    {/*    variant="contained"*/}
    {/*    onClick={() => navigate('./@new')}*/}
    {/*  >*/}
    {/*    Dodaj*/}
    {/*  </Button>*/}

    {/*</Toolbar>*/}

    {/*<Divider sx={{mt: 1}}/>*/}

    {/*{productListQuery.isPending ? (*/}
    {/*  <div>Loading</div>*/}
    {/*) : productListQuery.isError ? (*/}
    {/*  <div>Error</div>*/}
    {/*) : (*/}
    {/*  <List>*/}
    {/*    {productListQuery.data.items.map(item => {*/}
    {/*      return <ProductItem key={item} productId={item}/>*/}
    {/*    })}*/}
    {/*  </List>*/}
    {/*)}*/}

  </PageContainer>;
};

export default SearchProductsPage;

const ProductItem: FC<{ productId: string }> = props => {
  const navigate = useNavigate();
  const productQuery = useGetProductQuery(props.productId);

  if (productQuery.isPending) {
    return <div>Loading</div>
  }

  if (productQuery.isError) {
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
        onClick={() => navigate(`./${props.productId}`)}
        edge="end"
      >
        <EditIcon/>
      </IconButton>
    </>}
  >
    <ListItemText primary={productQuery.data.tradeName}/>
  </ListItem>
}
