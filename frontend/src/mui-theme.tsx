import {createTheme, CssBaseline, useMediaQuery, useTheme} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {FC, ReactNode, useMemo} from "react";
import {ReactRouterMuiLink} from "./react-router.tsx";

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    // xs: false;
    // sm: false;
    // md: false;
    // lg: false;
    // xl: false;
    mobile: true;
    desktop: true;
  }
}

export function useIsMobileLayout() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('desktop'));
}


export const MyThemeProvider: FC<{
  children: ReactNode;
}> = props => {

  const theme = useMemo(() => {
    return createTheme({
      zIndex:{

      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1536,

          mobile: 0,
          desktop: 640,
        },
      },
      components: {
        MuiLink: {
          defaultProps: {
            component: ReactRouterMuiLink,
          },
        },
        MuiTextField: {
          defaultProps: {
            size: "small"
          }
        },
        MuiButtonBase: {
          defaultProps: {
            LinkComponent: ReactRouterMuiLink,
          },
        },
      },
    });
  }, []);

  return <ThemeProvider theme={theme}>
    <CssBaseline/>
    {props.children}
  </ThemeProvider>
};
