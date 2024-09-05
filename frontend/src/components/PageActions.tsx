import {createContext, FC, ReactNode, useContext, useMemo, useState} from "react";
import {Button, ListItemIcon, ListItemText, MenuItem, Portal} from "@mui/material";
import {useIsMobileLayout} from "../mui-theme.tsx";

type ActionPlacement = 'menu' | 'toolbar';

type Action = {
  icon?: ReactNode;
  label: ReactNode;
  handler: () => void;
  placement?: {
    mobile?: ActionPlacement;
    desktop?: ActionPlacement;
  };
};

const PageActions: FC<{
  actions: Action[];
}> = props => {
  return <>{props.actions.map((action, i) => <PageAction key={i} action={action}/>)}</>
}

export default PageActions;


const PageAction: FC<{
  action: Action;
}> = props => {
  const isMobileLayout = useIsMobileLayout();
  const {pageToolbarActionContainer, pageMenuActionContainer} = usePageContext();
  const {icon, label, handler, placement} = props.action;
  let placement2: ActionPlacement;

  if (isMobileLayout) {
    placement2 = placement?.mobile ?? 'menu';
  } else {
    placement2 = placement?.desktop ?? 'toolbar';
  }

  if (placement2 == 'menu') {
    if (!pageMenuActionContainer) return null;

    return <Portal container={pageMenuActionContainer}>
      <MenuItem
        onClick={handler}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{label}</ListItemText>
      </MenuItem>
    </Portal>
  }

  if (placement2 == 'toolbar') {
    return <Portal container={pageToolbarActionContainer}>
      <Button
        variant="contained"
        onClick={handler}
        startIcon={icon}
      >
        {label}
      </Button>
    </Portal>
  }

  return null;
}

const Context = createContext<{
  pageToolbarActionContainer: HTMLElement | null;
  setPageToolbarActionContainer: (arg: HTMLElement | null) => void;
  pageMenuActionContainer: HTMLElement | null;
  setPageMenuActionContainer: (arg: HTMLElement | null) => void;
}>({
  pageToolbarActionContainer: null,
  setPageMenuActionContainer: () => {
  },
  pageMenuActionContainer: null,
  setPageToolbarActionContainer: () => {
  },
});

export const PageActionsContextProvider: FC<{
  children: ReactNode;
}> = (props) => {
  const [pageToolbarActionContainer, setPageToolbarActionContainer] = useState<HTMLElement | null>(null);
  const [pageMenuActionContainer, setPageMenuActionContainer] = useState<HTMLElement | null>(null);

  const context = useMemo(() => {
    return {
      pageToolbarActionContainer, setPageToolbarActionContainer,
      pageMenuActionContainer, setPageMenuActionContainer,
    }
  }, [pageToolbarActionContainer, pageMenuActionContainer]);

  return <Context.Provider value={context}>
    {props.children}
  </Context.Provider>
}

export function usePageContext() {
  return useContext(Context);
}
