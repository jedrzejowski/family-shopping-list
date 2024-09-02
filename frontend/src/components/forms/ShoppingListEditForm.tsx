import {FC} from "react";
import * as model from "../../model.ts";
import {useForm} from "react-hook-form";
import {Box, Button, TextField, Toolbar} from "@mui/material";
import {useNavigate} from "react-router-dom";

const ShoppingListEditForm: FC<{
  isNew?: boolean | null;
  shoppingList: model.ShoppingList;
  onSubmitChange: (shoppingList: model.ShoppingList) => void;
  autoFocus?: boolean;
}> = (props) => {
  const {isNew = false} = props;
  const navigate = useNavigate();

  const form = useForm<model.ShoppingList>({
    defaultValues: props.shoppingList,
  });

  const handleSubmit = form.handleSubmit((data) => {
    props.onSubmitChange(data);
  });

  function handleAddNewItem() {
    navigate('./@newItem')
  }

  return <>
    <TextField
      label="Nazwa"
      {...form.register('name')}
      fullWidth
      autoFocus={props.autoFocus}
    />

    <Toolbar disableGutters sx={{gap: 2}}>
      {!isNew && <Button color="primary" variant="contained" onClick={handleAddNewItem}>Dodaj pozycję</Button>}

      <Box sx={{flexGrow: 1}}/>
      <Button color="primary" onClick={() => form.reset()}>Anuluj</Button>
      <Button color="primary" variant="contained" onClick={handleSubmit}>Zapisz</Button>
    </Toolbar>
  </>
}

export default ShoppingListEditForm;

