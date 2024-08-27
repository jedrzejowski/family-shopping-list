import {FC} from "react";
import {useCreateShopMutation} from "../../state/shops.ts";
import PageContainer from "../../components/PageContainer.tsx";
import ShopEditForm from "../../components/forms/ShopEditForm.tsx";
import * as model from "../../model.ts";
import {useFamilyId} from "../../state/family.ts";
import {NIL} from "uuid";
import PageTitle from "../../components/PageTitle.tsx";
import {useNavigate} from "react-router-dom";


const CreateShopPage: FC = () => {
  const navigate = useNavigate();
  const shopMutation = useCreateShopMutation();
  const familyId = useFamilyId();

  const baseNewShop: model.Shop = {
    familyId,
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
