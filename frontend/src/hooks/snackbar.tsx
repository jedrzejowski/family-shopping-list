import {SnackbarMessage, useSnackbar, VariantType} from "notistack";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {useCallback} from "react";

interface FastSnackbar {
  (variant: VariantType, message: SnackbarMessage): void;

  (variant: 'saved' | 'deleted'): void;

  (variant: 'error'): void;
}

export function useFastSnackbar() {
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  return useCallback<FastSnackbar>((arg1, arg2?) => {

    let variant: VariantType;
    let message: SnackbarMessage;

    if (arg2) {
      variant = arg1 as VariantType;
      message = arg2 as SnackbarMessage;
    } else if (arg1 === 'saved') {
      variant = 'success';
      message = 'Zapisano';
    } else if (arg1 === 'deleted') {
      variant = 'default';
      message = 'Usunięto';
    } else if (arg1 === 'error') {
      variant = 'error';
      message = 'Wystąpił błąd';
    } else {
      throw new Error('unknown args');
    }

    enqueueSnackbar({
      message: message,
      variant: variant,
      action: key => <>
        <IconButton
          aria-label="close"
          color="inherit"
          sx={{p: 0.5}}
          onClick={() => closeSnackbar(key)}
        >
          <CloseIcon/>
        </IconButton>
      </>
    });
  }, [enqueueSnackbar, closeSnackbar]);
}
