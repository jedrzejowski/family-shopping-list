import {FC} from "react";
import {useGetShopQuery, useUpdateShopMutation} from "../../state/stdRepos.ts";
import PageContainer from "../../components/PageContainer.tsx";
import ShopEditForm from "../../components/forms/ShopEditForm.tsx";
import PageTitle from "../../components/PageTitle.tsx";

const EditShopPage: FC<{
  shopId: string;
}> = props => {
  const shopQuery = useGetShopQuery(props.shopId);
  const shopMutation = useUpdateShopMutation();

  if (shopQuery.isPending) {
    return <div>Loading</div>
  }

  if (shopQuery.isError) {
    return <div>Error</div>
  }

  return <PageContainer>

    <PageTitle title="Edycja sklepu"/>

    <ShopEditForm
      shop={shopQuery.data}
      onSubmitChange={(data) => shopMutation.mutate(data)}
      autoFocus
    />
  </PageContainer>
};

export default EditShopPage;
