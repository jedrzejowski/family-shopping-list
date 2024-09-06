import {FC, Fragment, ReactNode} from "react";
import {Box, Checkbox, colors, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {useIsMobileLayout} from "../../mui-theme.tsx";

type SearchableItemAction = {
  icon: 'delete' | 'edit' | ReactNode;
  label: ReactNode;
  handler: () => void;
};

const SearchableItem: FC<{
  checkbox?: boolean | null;
  onCheckboxChanged?: (checked: boolean) => void;
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
      onClick={event => {
        if (
          props.onCheckboxChanged &&
          (event.target as HTMLElement).tagName === "INPUT"
        ) {
          props.onCheckboxChanged((event.target as HTMLInputElement).checked)
        } else {
          props.primaryAction();
        }
      }}
      sx={{
        pr: (16 + 40 * (props.secondaryActions?.length ?? 0)) + 'px',
      }}
    >

      {typeof props.checkbox === 'boolean' && (
        <ListItemIcon>
          <Checkbox
            sx={{mt: -1, mb: -1}}
            edge="start"
            checked={props.checkbox}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
      )}

      <ListItemText primary={props.primaryText}/>
    </ListItemButton>
  </ListItem>
}
export default SearchableItem;
