import {FC, ReactNode} from "react";
import {IconButton, Toolbar, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router-dom";

const PageTitle: FC<{
  title: ReactNode;
  children?: ReactNode;
}> = (props) => {
  const navigate = useNavigate();

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

    {props.children}
  </Toolbar>
}

export default PageTitle;
