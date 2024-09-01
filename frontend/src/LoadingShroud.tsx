import {createContext, FC, memo, ReactNode, useCallback, useContext, useState} from "react";
import {Backdrop, CircularProgress} from "@mui/material";

interface UseLoadingShroud {
  (arg: boolean): void;
}

const Context = createContext<UseLoadingShroud>(null as unknown as UseLoadingShroud);

export const LoadingShroudProvider: FC<{
  children: ReactNode;
}> = memo(props => {
  const [isVisible, setIsVisible] = useState(false)

  const useLoadingShroud = useCallback<UseLoadingShroud>((arg) => {
    setIsVisible(arg);
  }, [setIsVisible]);

  return <Context.Provider value={useLoadingShroud}>

    <Backdrop
      sx={{ color: '#fff', zIndex: 2000 }}
      open={isVisible}
    >
      <CircularProgress color="inherit" />
    </Backdrop>

    {props.children}
  </Context.Provider>
});

export function useLoadingShroud() {
  return useContext(Context);
}
