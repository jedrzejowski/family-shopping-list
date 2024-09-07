import {FC} from "react";
import {
  useDeleteProductUx,
  useGetProductQuery,
  useSearchProductQuery
} from "../../state/stdRepos.ts";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import PageContainer from "../../components/PageContainer.tsx";
import PageTitle from "../../components/PageTitle.tsx";
import Searchable from "../../components/Searchable/Searchable.tsx";
import SearchableItem from "../../components/Searchable/SearchableItem.tsx";


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

  const handleEdit = () => {
    navigate(`./${props.productId}`)
  }

  if (productQuery.isPending) {
    return <div>Loading</div>
  }

  if (productQuery.isError) {
    return <div>Error</div>
  }

  return <>
    {deleteUx.dialog}
    <SearchableItem
      primaryText={productQuery.data.tradeName}
      primaryAction={handleEdit}
      secondaryActions={[
        {icon: 'delete', label: 'Usuń', handler: deleteUx.start},
        {icon: 'edit', label: 'Edytuj', handler: handleEdit},
      ]}
    />
  </>
}
