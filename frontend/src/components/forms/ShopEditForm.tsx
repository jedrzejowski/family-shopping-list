import {FC} from "react";
import * as model from "../../model.ts";
import {useForm} from "react-hook-form";
import {Box, Button, TextField, Toolbar} from "@mui/material";

const ShopEditForm: FC<{
  shop: model.Shop;
  onSubmitChange: (shop: model.Shop) => void;
  autoFocus?: boolean;
}> = (props) => {

  const form = useForm<model.Shop>({
    defaultValues: props.shop,
  });

  const handleSubmit = form.handleSubmit((data) => {
    props.onSubmitChange(data);
  });

  return <>
    <TextField
      label="Nazwa"
      {...form.register('brandName')}
      fullWidth
      autoFocus={props.autoFocus}
    />

    <TextField
      label="Miasto"
      {...form.register('addressCity')}
      fullWidth
      sx={{mt: 2}}
    />

    <TextField
      label="Ulica"
      {...form.register('addressStreet')}
      fullWidth
      sx={{mt: 2}}
    />

    <TextField
      label="Numer ulicy"
      {...form.register('addressStreetNo')}
      fullWidth
      sx={{mt: 2}}
    />

    <Toolbar disableGutters sx={{gap: 2}}>
      <Box sx={{flexGrow: 1}}/>
      <Button color="primary" onClick={() => form.reset()}>Anuluj</Button>
      <Button color="primary" variant="contained" onClick={handleSubmit}>Zapisz</Button>
    </Toolbar>
  </>
}

export default ShopEditForm;
