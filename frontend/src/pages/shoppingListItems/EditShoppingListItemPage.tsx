import {FC} from "react";
import {shoppingListItemsRepo} from "../../state/stdRepos.ts";
import PageContainer from "../../components/PageContainer.tsx";
import ShoppingListItemEditForm from "../../components/forms/ShoppingListItemEditForm.tsx";
import PageTitle from "../../components/PageTitle.tsx";

const EditShoppingListItemPage: FC<{
  shoppingListItemId: string;
}> = props => {
  const shoppingListItemQuery = shoppingListItemsRepo.useGetQuery(props.shoppingListItemId);
  const shoppingListItemMutation = shoppingListItemsRepo.useUpdateMutation();

  if (shoppingListItemQuery.isPending) {
    return <div>Loading</div>
  }

  if (shoppingListItemQuery.isError) {
    return <div>Error</div>
  }

  return <PageContainer>

    <PageTitle title="Edycja pozycji na liście"/>

    <ShoppingListItemEditForm
      shoppingListItem={shoppingListItemQuery.data}
      onSubmitChange={(data) => shoppingListItemMutation.mutate(data)}
    />
  </PageContainer>
};

export default EditShoppingListItemPage;
