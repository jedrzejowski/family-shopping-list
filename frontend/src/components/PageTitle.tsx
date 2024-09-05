import {FC, ReactNode} from "react";
import {Box, IconButton, Toolbar, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router-dom";
import {usePageContext} from "./PageActions.tsx";

const PageTitle: FC<{
  title: ReactNode;
  children?: ReactNode;
}> = (props) => {
  const navigate = useNavigate();
  const {setPageToolbarActionContainer} = usePageContext();

  return <Toolbar disableGutters>

    <IconButton
      size="large"
      edge="start"
      onClick={() => navigate(-1)}
    >
      <ArrowBackIcon/>
    </IconButton>

    <Typography variant="h6" sx={{flexGrow: 1}}>
      {props.title}
    </Typography>

    <Box
      ref={setPageToolbarActionContainer}
      sx={{display:'flex', gap: 1}}
    >
      {props.children}
    </Box>
  </Toolbar>
}

export default PageTitle;
