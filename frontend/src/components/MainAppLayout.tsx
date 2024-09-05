import {FC, ReactNode, useState} from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  SwipeableDrawer,
  Divider,
} from "@mui/material";
import MainAppDrawerContent from "./MainAppDrawerContent.tsx";
import {useIsMobileLayout} from "../mui-theme.tsx";
import MainAppBarToolbar from "./MainAppBarToolbar.tsx";

const drawerWidth = 240;

const MainAppLayout: FC<{
  children?: ReactNode;
}> = props => {
  const isMobileLayout = useIsMobileLayout();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleCloseDrawer = () => setIsMobileDrawerOpen(false)
  const handleOpenDrawer = () => setIsMobileDrawerOpen(true)

  return <Box sx={{display: 'flex'}}>

    <AppBar
      position="fixed"
      component="nav"
      sx={{zIndex: (theme) => theme.zIndex.drawer + (isMobileLayout ? -1 : 1)}}
    >
      <MainAppBarToolbar onOpenDrawer={handleOpenDrawer}/>
    </AppBar>

    {isMobileLayout ? (
      <SwipeableDrawer
        anchor="left"
        variant="temporary"
        open={isMobileDrawerOpen}
        onClose={handleCloseDrawer}
        onOpen={handleOpenDrawer}
        sx={{
          [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'},
        }}
      >
        <Toolbar/>
        <Divider/>
        <MainAppDrawerContent onNavigated={handleCloseDrawer}/>
      </SwipeableDrawer>
    ) : (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'},
        }}
      >
        <Toolbar/>
        <Box sx={{overflow: 'auto'}}>
          <MainAppDrawerContent onNavigated={handleCloseDrawer}/>
        </Box>
      </Drawer>
    )}

    <Box
      component="main"
      sx={{flex: 1}}
    >
      <Toolbar/>

      {props.children}
    </Box>

  </Box>
}

export default MainAppLayout;

