import {FC} from "react";
import {shopsRepo} from "../../state/stdRepos.ts";
import PageContainer from "../../components/PageContainer.tsx";
import ShopEditForm from "../../components/forms/ShopEditForm.tsx";
import * as model from "../../model.ts";
import {NIL} from "uuid";
import PageTitle from "../../components/PageTitle.tsx";
import {useNavigate} from "react-router-dom";


const CreateShopPage: FC = () => {
  const navigate = useNavigate();
  const shopMutation = shopsRepo.useCreateMutation();

  const baseNewShop: model.Shop = {
    shopId: NIL,
    brandName: '',
  }

  function handleSubmit(shop: model.Shop) {
    shopMutation.mutate(shop, {
      onSuccess(shopId) {
        navigate(`/shops/${shopId}`, {replace: true});
      }
    });
  }

  return <PageContainer>

    <PageTitle title="Nowy sklep"/>

    <ShopEditForm
      shop={baseNewShop}
      onSubmitChange={handleSubmit}
      autoFocus
    />
  </PageContainer>
};

export default CreateShopPage;
