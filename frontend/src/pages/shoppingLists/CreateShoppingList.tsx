import {FC} from "react";
import {useCreateShoppingListMutation} from "../../state/stdRepos.ts";
import PageContainer from "../../components/PageContainer.tsx";
import ShoppingListEditForm from "../../components/forms/ShoppingListEditForm.tsx";
import * as model from "../../model.ts";
import {NIL} from "uuid";
import PageTitle from "../../components/PageTitle.tsx";
import {useNavigate} from "react-router-dom";


const CreateShoppingListPage: FC = () => {
  const navigate = useNavigate();
  const shopMutation = useCreateShoppingListMutation();

  const baseNewShoppingList: model.ShoppingList = {
    shoppingListId: NIL,
    name: '',
  }

  function handleSubmit(shoppingList: model.ShoppingList) {
    shopMutation.mutate(shoppingList, {
      onSuccess(shoppingListId) {
        navigate(`/shopping-lists/${shoppingListId}`, {replace: true});
      }
    });
  }

  return <PageContainer>

    <PageTitle title="Nowa lista zakupów"/>

    <ShoppingListEditForm
      isNew
      shoppingList={baseNewShoppingList}
      onSubmitChange={handleSubmit}
      autoFocus
    />
  </PageContainer>
};

export default CreateShoppingListPage;
