import {EnqueueSnackbar, SnackbarKey, SnackbarMessage, useSnackbar, VariantType} from "notistack";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {ReactNode, useMemo} from "react";

interface FastSnackbar {
  (variant: 'deleted'): SnackbarKey;

  (variant: 'saved'): SnackbarKey;

  (variant: 'error'): SnackbarKey;

  (args: {
    variant: VariantType;
    message: SnackbarMessage;
    actions?: FastSnackbarAction[]
    key?: SnackbarKey;
  }): SnackbarKey;

  enqueueSnackbar: EnqueueSnackbar;
  closeSnackbar: (key?: SnackbarKey) => void;
}

export type FastSnackbarAction =
  | undefined
  | null
  | 'close'
  | { icon: ReactNode; handler: () => void }

export function useFastSnackbar() {
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  return useMemo<FastSnackbar>(() => {
    const fastSnackbar: FastSnackbar = arg => {

      if (arg === 'saved') {
        arg = {
          variant: 'success',
          message: 'Zapisano',
        }
      } else if (arg === 'deleted') {
        arg = {
          variant: 'default',
          message: 'Usunięto',
        }
      } else if (arg === 'error') {
        arg = {
          variant: 'error',
          message: 'Wystąpił błąd',
        }
      }

      const actions = (arg.actions ?? ['close']);

      return enqueueSnackbar({
        message: arg.message,
        variant: arg.variant,
        key: arg.key,
        action: key => actions.map((action, i) => {
          if (action === undefined || action === null) return null;

          if (action === 'close') {
            return <IconButton
              key={i}
              color="inherit"
              sx={{p: 0.5}}
              onClick={() => closeSnackbar(key)}
            >
              <CloseIcon/>
            </IconButton>
          }

          return <IconButton
            key={i}
            color="inherit"
            sx={{p: 0.5}}
            onClick={() => {
              action.handler();
              closeSnackbar(key);
            }}
          >
            {action.icon}
          </IconButton>
        })
      });
    }

    fastSnackbar.closeSnackbar = closeSnackbar;
    fastSnackbar.enqueueSnackbar = enqueueSnackbar;
    return fastSnackbar;
  }, [enqueueSnackbar, closeSnackbar]);
}
