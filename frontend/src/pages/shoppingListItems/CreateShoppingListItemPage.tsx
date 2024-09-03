import {FC} from "react";
import {useCreateShoppingListItemMutation} from "../../state/stdRepos.ts";
import PageContainer from "../../components/PageContainer.tsx";
import * as model from "../../model.ts";
import {NIL} from "uuid";
import PageTitle from "../../components/PageTitle.tsx";
import {useNavigate} from "react-router-dom";
import ShoppingListItemEditForm from "../../components/forms/ShoppingListItemEditForm.tsx";


const CreateShoppingListItemPage: FC<{
  shoppingListId: string;
}> = props => {
  const navigate = useNavigate();
  const shoppingListItemMutation = useCreateShoppingListItemMutation();

  const baseNewShoppingListItem: model.ShoppingListItem = {
    shoppingListItemId: NIL,
    shoppingListId: props.shoppingListId,
    isChecked: false,
    productId: NIL,
    sortOrder: 0,
  }

  function handleSubmit(shoppingListItem: model.ShoppingListItem) {
    shoppingListItemMutation.mutate(shoppingListItem, {
      onSuccess(shoppingListItemId) {
        navigate(`/shopping-list-items/${shoppingListItemId}`, {replace: true});
      }
    });
  }

  return <PageContainer>

    <PageTitle title="Nowa pozycja na liście"/>

    <ShoppingListItemEditForm
      shoppingListItem={baseNewShoppingListItem}
      onSubmitChange={handleSubmit}
      autoFocus
    />
  </PageContainer>
};

export default CreateShoppingListItemPage;
