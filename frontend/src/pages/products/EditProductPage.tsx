import {FC} from "react";
import {useGetProductQuery, useUpdateProductMutation} from "../../state/stdRepos.ts";
import PageContainer from "../../components/PageContainer.tsx";
import ProductEditForm from "../../components/forms/ProductEditForm.tsx";
import PageTitle from "../../components/PageTitle.tsx";

const EditProductPage: FC<{
  productId: string;
}> = props => {
  const productQuery = useGetProductQuery(props.productId);
  const productMutation = useUpdateProductMutation();

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
      autoFocus
    />
  </PageContainer>
};

export default EditProductPage;
