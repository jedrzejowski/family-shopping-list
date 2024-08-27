import {FC} from "react";
import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useNavigate} from "react-router-dom";

const MainAppDrawerContent: FC<{
  onNavigated?: () => void;
}> = props => {
  const navigate = useNavigate();

  function handleNavigateFactory(to: string) {
    return () => {
      navigate(to)

      setTimeout(() => {
        props.onNavigated?.();
      }, 400)
    }
  }

  return <List>

    <ListItem disablePadding>
      <ListItemButton onClick={handleNavigateFactory('/products')}>
        <ListItemText primary="Produkty"/>
      </ListItemButton>
    </ListItem>

    <ListItem disablePadding>
      <ListItemButton onClick={handleNavigateFactory('/shops')}>
        <ListItemText primary="Sklepy"/>
      </ListItemButton>
    </ListItem>

  </List>
}

export default MainAppDrawerContent;

