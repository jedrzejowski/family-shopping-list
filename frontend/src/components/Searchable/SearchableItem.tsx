import {FC, Fragment, ReactNode} from "react";
import {Box, colors, IconButton, ListItem, ListItemButton, ListItemText} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {useIsMobileLayout} from "../../mui-theme.tsx";

type SearchableItemAction = {
  icon: 'delete' | 'edit' | ReactNode;
  label: ReactNode;
  handler: () => void;
};

const SearchableItem: FC<{
  primaryText: ReactNode;
  primaryAction: () => void;
  secondaryActions?: SearchableItemAction[];
}> = props => {
  const isMobileLayout = useIsMobileLayout();

  const secondaryAction = props.secondaryActions
    ? <Box sx={{marginRight: '-16px'}}>{
      props.secondaryActions.map((action) => {
        // eslint-disable-next-line prefer-const
        let {handler, icon} = action;

        switch (icon) {
          case "edit":
            icon = <EditIcon/>;
            break
          case "delete":
            icon = <DeleteIcon sx={{color: colors.red[500]}}/>;
            break
        }

        return <IconButton onClick={handler}>
          {icon}
        </IconButton>
      }).map((elem, i) => <Fragment key={i}>{elem}</Fragment>)
    }</Box>
    : undefined;

  return <ListItem
    disablePadding
    sx={{
      '&:hover': !isMobileLayout ? {
        background: theme => theme.palette.action.hover,
      } : null
    }}
    secondaryAction={secondaryAction}
  >
    <ListItemButton
      onClick={props.primaryAction}
      sx={{
        pr: (16 + 40 * (props.secondaryActions?.length ?? 0)) + 'px',
      }}
    >
      <ListItemText primary={props.primaryText}/>
    </ListItemButton>
  </ListItem>
}
export default SearchableItem;
