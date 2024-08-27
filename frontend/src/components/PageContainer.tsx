import {FC, ReactNode} from "react";
import {Container} from "@mui/material";

const PageContainer: FC<{
  children: ReactNode;
}> = (props) => {

  return <Container>

    {props.children}
  </Container>
}

export default PageContainer;
