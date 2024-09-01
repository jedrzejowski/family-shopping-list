import {FC} from "react";
import * as model from "../../model.ts";
import {useForm} from "react-hook-form";
import {Box, Button, TextField, Toolbar} from "@mui/material";

const ShoppingListEditForm: FC<{
  shoppingList: model.ShoppingList;
  onSubmitChange: (shoppingList: model.ShoppingList) => void;
  autoFocus?: boolean;
}> = (props) => {

  const form = useForm<model.ShoppingList>({
    defaultValues: props.shoppingList,
  });

  const handleSubmit = form.handleSubmit((data) => {
    props.onSubmitChange(data);
  });

  return <>
    <TextField
      label="Nazwa"
      {...form.register('name')}
      fullWidth
      autoFocus={props.autoFocus}
    />

    <Toolbar disableGutters sx={{gap: 2}}>
      <Box sx={{flexGrow: 1}}/>
      <Button color="primary" onClick={() => form.reset()}>Anuluj</Button>
      <Button color="primary" variant="contained" onClick={handleSubmit}>Zapisz</Button>
    </Toolbar>
  </>
}

export default ShoppingListEditForm;
