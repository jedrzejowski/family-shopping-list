import {FC} from "react";
import {shopsRepo} from "../../state/stdRepos.ts";
import PageContainer from "../../components/PageContainer.tsx";
import ShopEditForm from "../../components/forms/ShopEditForm.tsx";
import PageTitle from "../../components/PageTitle.tsx";

const EditShopPage: FC<{
  shopId: string;
}> = props => {
  const shopQuery = shopsRepo.useGetQuery(props.shopId);
  const shopMutation = shopsRepo.useUpdateMutation();

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
    />
  </PageContainer>
};

export default EditShopPage;
