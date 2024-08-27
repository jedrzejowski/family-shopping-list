import {FC} from "react";
import * as model from "../../model.ts";
import {useForm} from "react-hook-form";
import {Box, Button, TextField, Toolbar} from "@mui/material";

const ProductEditForm: FC<{
  product: model.Product;
  onSubmitChange: (product: model.Product) => void;
  autoFocus?: boolean;
}> = (props) => {

  const form = useForm<model.Product>({
    defaultValues: props.product,
  });

  const handleSubmit = form.handleSubmit((data) => {
    props.onSubmitChange(data);
  });

  return <>
    <TextField
      label="Nazwa"
      {...form.register('tradeName')}
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

export default ProductEditForm;
