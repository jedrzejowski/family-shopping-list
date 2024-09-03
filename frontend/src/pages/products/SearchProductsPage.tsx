import {FC} from "react";
import {
  useDeleteProductUx,
  useGetProductQuery,
  useSearchProductQuery
} from "../../state/stdRepos.ts";
import {IconButton, ListItem, ListItemText, colors, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import PageContainer from "../../components/PageContainer.tsx";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PageTitle from "../../components/PageTitle.tsx";
import Searchable from "../../components/Searchable.tsx";


const SearchProductsPage: FC = () => {
  const navigate = useNavigate();

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

  </PageContainer>;
};

export default SearchProductsPage;

const ProductItem: FC<{ productId: string }> = props => {
  const navigate = useNavigate();
  const productQuery = useGetProductQuery(props.productId);
  const deleteUx = useDeleteProductUx(props.productId);

  if (productQuery.isPending) {
    return <div>Loading</div>
  }

  if (productQuery.isError) {
    return <div>Error</div>
  }

  return <>
    {deleteUx.dialog}
    <ListItem
      sx={{
        pr: (16 + 40 * 2) + 'px',
        '&:hover': {
          background: theme => theme.palette.action.hover,
        }
      }}
      secondaryAction={<>
        <IconButton onClick={() => deleteUx.start()}>
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
  </>
}
