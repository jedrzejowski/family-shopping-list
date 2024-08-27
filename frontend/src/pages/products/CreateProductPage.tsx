import {FC} from "react";
import {useCreateProductMutation} from "../../state/stdRepos.ts";
import PageContainer from "../../components/PageContainer.tsx";
import ProductEditForm from "../../components/forms/ProductEditForm.tsx";
import * as model from "../../model.ts";
import {NIL} from "uuid";
import PageTitle from "../../components/PageTitle.tsx";
import {useNavigate} from "react-router-dom";


const CreateProductPage: FC = () => {
  const navigate = useNavigate();
  const productMutation = useCreateProductMutation();

  const baseNewProduct: model.Product = {
    productId: NIL,
    tags: [],
    tradeName: ''
  }

  function handleSubmit(product: model.Product) {
    productMutation.mutate(product, {
      onSuccess(productId) {
        navigate(`/products/${productId}`, {replace: true});
      }
    });
  }

  return <PageContainer>

    <PageTitle title="Nowy produkt"/>

    <ProductEditForm
      product={baseNewProduct}
      onSubmitChange={handleSubmit}
      autoFocus
    />
  </PageContainer>
};

export default CreateProductPage;
