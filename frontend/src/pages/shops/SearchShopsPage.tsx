import {FC} from "react";
import {useGetShopQuery, useSearchShopQuery} from "../../state/stdRepos.ts";
import {IconButton, ListItem, ListItemText, colors, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import PageContainer from "../../components/PageContainer.tsx";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PageTitle from "../../components/PageTitle.tsx";
import Searchable from "../../components/Searchable.tsx";


const SearchShopsPage: FC = () => {
  const navigate = useNavigate();

  return <PageContainer>
    <PageTitle title="Produkty"/>

    <Searchable
      useSearchQuery={useSearchShopQuery}
      renderItem={productId => <ShopItem key={productId} shopId={productId}/>}
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
