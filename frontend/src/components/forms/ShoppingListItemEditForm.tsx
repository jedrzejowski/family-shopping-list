import {FC} from "react";
import * as model from "../../model.ts";
import {Controller, useForm} from "react-hook-form";
import {Box, Button, Toolbar} from "@mui/material";
import {ProductAutocomplete} from "../../state/stdRepos.ts";


const ShoppingListItemEditForm: FC<{
  shoppingListItem: model.ShoppingListItem;
  onSubmitChange: (shoppingListItem: model.ShoppingListItem) => void;
  autoFocus?: boolean;
}> = (props) => {

  const form = useForm<model.ShoppingListItem>({
    defaultValues: props.shoppingListItem,
  });

  const handleSubmit = form.handleSubmit((data) => {
    props.onSubmitChange(data);
  });

  return <>

    <Controller
      control={form.control}
      name="productId"
      render={({ field: { onChange, onBlur, value } }) => (
        <ProductAutocomplete
          label="Produkt"
          fullWidth
          onChange={onChange}
          onBlur={onBlur}
          value={value}
        />
      )}
    />

    <Toolbar disableGutters sx={{gap: 2}}>
      <Box sx={{flexGrow: 1}}/>
      <Button color="primary" onClick={() => form.reset()}>Anuluj</Button>
      <Button color="primary" variant="contained" onClick={handleSubmit}>Zapisz</Button>
    </Toolbar>
  </>
}

export default ShoppingListItemEditForm;
