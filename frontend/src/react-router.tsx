import {Link as RouterLink, LinkProps as RouterLinkProps} from 'react-router-dom';
import {forwardRef} from "react";

export const ReactRouterMuiLink = forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
    const {href, ...other} = props;
    // Map href (Material UI) -> to (react-router)
    return <RouterLink ref={ref} to={href} {...other} />;
});