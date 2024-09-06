import {MouseEvent, useId} from 'react';
import {IconButton, Menu, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {FC, useState} from "react";
import MoreIcon from '@mui/icons-material/MoreVert';
import {useIsMobileLayout} from "../mui-theme.tsx";
import {usePageContext} from "./PageActions.tsx";

const MainAppBarToolbar: FC<{
  onOpenDrawer: () => void;
}> = props => {
  const isMobileLayout = useIsMobileLayout();

  return <Toolbar>

    <IconButton
      size="large"
      edge="start"
      color="inherit"
      onClick={props.onOpenDrawer}
      sx={{display: {desktop: 'none'}, mr: 1}}
    >
      <MenuIcon/>
    </IconButton>

    <Typography
      variant="h6"
      component="div"
      sx={{flexGrow: 1}}
    >
      Zakupy rodzinne
    </Typography>

    {isMobileLayout && <MyMenu/>}
  </Toolbar>
}

export default MainAppBarToolbar;

const MyMenu: FC = () => {
  const id = useId();
  const {setPageMenuActionContainer} = usePageContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = !!anchorEl;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return <>
    <IconButton
      size="large"
      aria-controls={isOpen ? id : undefined}
      aria-haspopup="true"
      aria-expanded={isOpen ? 'true' : undefined}
      edge="end"
      color="inherit"
      onClick={handleClick}
    >
      <MoreIcon/>
    </IconButton>

    <Menu
      id={id}
      anchorEl={anchorEl}
      anchorOrigin={{vertical: "top", horizontal: "right"}}
      open={isOpen}
      onClose={handleClose}
      MenuListProps={{
        ref: setPageMenuActionContainer
      }}
    >
    </Menu>
  </>
}
