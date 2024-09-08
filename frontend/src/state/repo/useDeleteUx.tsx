import {ReactElement, useCallback, useRef, useState} from "react";
import {UseMutationResult} from "@tanstack/react-query";
import {UseDeleteEntityMutation, UseEntityText, UseGetEntityQuery} from "./repo.tsx";
import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";

export interface UseDeleteUx {
  (entityId: string): {
    dialog: ReactElement | null,
    start: () => void,
    mutation: UseMutationResult<string, Error, string, void>
  }
}

export function createUseDeleteUx<M>(args: {
  useEntityText: UseEntityText;
  useDeleteEntityMutation: UseDeleteEntityMutation;
  useGetEntityQuery: UseGetEntityQuery<M>;
}): UseDeleteUx {

  return (id) => {
    const entityText = args.useEntityText(id);
    const mutation = args.useDeleteEntityMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const dialogLatch = useRef(false);

    function handleDialogOk() {
      setIsDialogOpen(false);
      mutation.mutate(id);
    }

    function handleDialogCancel() {
      setIsDialogOpen(false);
    }

    const dialog = dialogLatch.current ? (
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogCancel}
      >
        <DialogTitle>
          Czy na pewno usunąć '{entityText}'?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogOk} variant="outlined" color="error">Tak</Button>
          <Button onClick={handleDialogCancel} autoFocus>Nie</Button>
        </DialogActions>
      </Dialog>
    ) : null;

    const start = useCallback(() => {
      dialogLatch.current = true;
      setIsDialogOpen(true);
    }, []);

    return {dialog, start, mutation}
  }

}