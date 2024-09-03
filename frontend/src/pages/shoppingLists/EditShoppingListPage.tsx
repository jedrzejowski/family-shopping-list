import {FC} from "react";
import {useGetShoppingListQuery, useUpdateShoppingListMutation} from "../../state/stdRepos.ts";
import PageContainer from "../../components/PageContainer.tsx";
import ShoppingListEditForm from "../../components/forms/ShoppingListEditForm.tsx";
import PageTitle from "../../components/PageTitle.tsx";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

const EditShoppingListPage: FC<{
  shoppingListId: string;
}> = props => {
  const navigate = useNavigate();
  const shoppingListQuery = useGetShoppingListQuery(props.shoppingListId);
  const shoppingListMutation = useUpdateShoppingListMutation();

  if (shoppingListQuery.isPending) {
    return <div>Loading</div>
  }

  if (shoppingListQuery.isError) {
    return <div>Error</div>
  }

  return <PageContainer>

    <PageTitle title="Edycja listy zakupowej">

      <Button
        variant="contained"
        onClick={() => navigate(`/shopping-lists/${props.shoppingListId}/items`)}
      >
        Pozycje
      </Button>
    </PageTitle>

    <ShoppingListEditForm
      shoppingList={shoppingListQuery.data}
      onSubmitChange={(data) => shoppingListMutation.mutate(data)}
      autoFocus
    />
  </PageContainer>
};

export default EditShoppingListPage;
