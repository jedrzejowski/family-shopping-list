import {FC, MouseEvent, ReactNode, useId, useState} from "react";
import {
  Box,
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText, Menu, MenuItem,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {useIsMobileLayout} from "../../mui-theme.tsx";
import AppIcon, {AppIconName} from "../AppIcon.tsx";
import MoreIcon from "@mui/icons-material/MoreVert";

type SearchableItemAction = {
  icon: AppIconName;
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
  const theme = useTheme();
  const secondaryActionsMenuId = useId();
  const secondaryActionsAsMenu = useMediaQuery(theme.breakpoints.down('lg'));
  const [secondaryActionMenuAnchorEl, setSecondaryActionMenuAnchorEl] = useState<HTMLElement | null>(null);


  let lisItemSecondaryAction: ReactNode = null;
  if (props.secondaryActions && props.secondaryActions.length > 0) {
    if (secondaryActionsAsMenu) {
      const isOpen = !!secondaryActionMenuAnchorEl;

      const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setSecondaryActionMenuAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setSecondaryActionMenuAnchorEl(null);
      };

      lisItemSecondaryAction = <>
        <IconButton
          size="large"
          aria-controls={isOpen ? secondaryActionsMenuId : undefined}
          aria-haspopup="true"
          aria-expanded={isOpen ? 'true' : undefined}
          edge="end"
          color="inherit"
          onClick={handleClick}
        >
          <MoreIcon/>
        </IconButton>

        <Menu
          id={secondaryActionsMenuId}
          anchorEl={secondaryActionMenuAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isOpen}
          onClose={handleClose}
        >
          {props.secondaryActions.map((action, i) => {
            return <MenuItem key={i} onClick={action.handler}>
              <ListItemIcon>
                <AppIcon name={action.icon}/>
              </ListItemIcon>
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          })}
        </Menu>
      </>

    } else {
      lisItemSecondaryAction = <Box sx={{marginRight: '-16px'}}>{
        props.secondaryActions.map((action, i) => {
          return <IconButton key={i} onClick={action.handler}>
            <AppIcon name={action.icon}/>
          </IconButton>
        })
      }</Box>
    }
  }

  return <ListItem
    disablePadding
    sx={{
      '&:hover': !isMobileLayout ? {
        background: theme => theme.palette.action.hover,
      } : null
    }}
    secondaryAction={lisItemSecondaryAction}
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
