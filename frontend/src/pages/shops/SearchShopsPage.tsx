import {FC} from "react";
import {useDeleteShopUx, useGetShopQuery, useSearchShopQuery} from "../../state/stdRepos.ts";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import PageContainer from "../../components/PageContainer.tsx";
import PageTitle from "../../components/PageTitle.tsx";
import Searchable from "../../components/Searchable/Searchable.tsx";
import SearchableItem from "../../components/Searchable/SearchableItem.tsx";


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
  const deleteUx = useDeleteShopUx(props.shopId);

  const handleEdit = () => {
    navigate(`./${props.shopId}`)
  }

  if (shopQuery.isPending) {
    return <div>Loading</div>
  }

  if (shopQuery.isError) {
    return <div>Error</div>
  }

  return <>
    {deleteUx.dialog}
    <SearchableItem
      primaryText={shopQuery.data.brandName}
      primaryAction={handleEdit}
      secondaryActions={[
        {icon: 'delete', label: 'Usuń', handler: deleteUx.start},
        {icon: 'edit', label: 'Edytuj', handler: handleEdit},
      ]}
    />
  </>
}
