import {FC, useState} from "react";
import * as model from "../../model.ts";
import {useForm} from "react-hook-form";
import {Box, Button, Toolbar} from "@mui/material";
import {ProductAutocomplete} from "../../state/stdRepos.ts";
import {uuidRegex} from "../../regex.ts";


const ShoppingListItemEditForm: FC<{
  shoppingListItem: model.ShoppingListItem;
  onSubmitChange: (shoppingListItem: model.ShoppingListItem) => void;
  autoFocus?: boolean;
}> = (props) => {
  const [productInput, setProductInput] = useState<string | null>(props.shoppingListItem.productName ?? props.shoppingListItem.productId ?? null);

  const form = useForm<model.ShoppingListItem>({
    defaultValues: props.shoppingListItem,
  });

  const handleSubmit = form.handleSubmit((data) => {
    props.onSubmitChange(data);
  });

  function handleProductChange(productInput: string | null) {
    setProductInput(productInput);

    if (!productInput) {
      form.setValue('productId', null);
      form.setValue('productName', null);
      return;
    }

    if (uuidRegex.test(productInput)) {
      form.setValue('productId', productInput);
      form.setValue('productName', null);
      return;
    }

    form.setValue('productId', null);
    form.setValue('productName', productInput);
  }

  return <>

    <ProductAutocomplete
      allowCustomInput
      label="Produkt"
      fullWidth
      onChange={handleProductChange}
      value={productInput ?? ''}
    />

    {/*<Controller*/}
    {/*  control={form.control}*/}
    {/*  name="productId"*/}
    {/*  render={({ field: { onChange, onBlur, value } }) => (*/}
    {/*    <ProductAutocomplete*/}

    {/*      label="Produkt"*/}
    {/*      fullWidth*/}
    {/*      onChange={onChange}*/}
    {/*      onBlur={onBlur}*/}
    {/*      value={value}*/}
    {/*    />*/}
    {/*  )}*/}
    {/*/>*/}

    <Toolbar disableGutters sx={{gap: 2}}>
      <Box sx={{flexGrow: 1}}/>
      <Button color="primary" onClick={() => form.reset()}>Anuluj</Button>
      <Button color="primary" variant="contained" onClick={handleSubmit}>Zapisz</Button>
    </Toolbar>
  </>
}

export default ShoppingListItemEditForm;
