import {FC} from "react";
import {productsRepo} from "../../state/stdRepos.ts";
import PageContainer from "../../components/PageContainer.tsx";
import ProductEditForm from "../../components/forms/ProductEditForm.tsx";
import PageTitle from "../../components/PageTitle.tsx";

const EditProductPage: FC<{
  productId: string;
}> = props => {
  const productQuery = productsRepo.useGetQuery(props.productId);
  const productMutation = productsRepo.useUpdateMutation();

  if (productQuery.isPending) {
    return <div>Loading</div>
  }

  if (productQuery.isError) {
    return <div>Error</div>
  }

  return <PageContainer>

    <PageTitle title="Edycja produktu"/>

    <ProductEditForm
      product={productQuery.data}
      onSubmitChange={(data) => productMutation.mutate(data)}
    />
  </PageContainer>
};

export default EditProductPage;
