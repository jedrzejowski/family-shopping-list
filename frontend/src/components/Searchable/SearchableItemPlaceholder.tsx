import {FC} from "react";
import {Skeleton, useTheme} from "@mui/material";

const SearchableItemPlaceholder: FC = () => {
  const theme = useTheme();

  return <Skeleton
    component="li"
    variant="rounded"
    height={'calc(48px - ' + theme.spacing(2) + ')'}
    sx={{
      '.MuiList-root > &:first-of-type': {
        mt: 1,
      },
      '.MuiList-root > & + .MuiSkeleton-root': {
        mt: 2,
      },
      '.MuiList-root > &:last-of-type': {
        mb: 1,
      }
    }}
  />;
  // return <ListItem
  //   disablePadding
  //   sx={{
  //     '&:hover': !isMobileLayout ? {
  //       background: theme => theme.palette.action.hover,
  //     } : null
  //   }}
  //   secondaryAction={lisItemSecondaryAction}
  // >
  //
  //   <ListItemButton
  //     onClick={event => {
  //       if (
  //         props.onCheckboxChanged &&
  //         (event.target as HTMLElement).tagName === "INPUT"
  //       ) {
  //         props.onCheckboxChanged((event.target as HTMLInputElement).checked)
  //       } else {
  //         props.primaryAction();
  //       }
  //     }}
  //     sx={{
  //       pr: (16 + 40 * (props.secondaryActions?.length ?? 0)) + 'px',
  //     }}
  //   >
  //
  //     {typeof props.checkbox === 'boolean' && (
  //       <ListItemIcon>
  //         <Checkbox
  //           sx={{mt: -1, mb: -1}}
  //           edge="start"
  //           checked={props.checkbox}
  //           tabIndex={-1}
  //           disableRipple
  //         />
  //       </ListItemIcon>
  //     )}
  //
  //     <ListItemText primary={props.primaryText}/>
  //   </ListItemButton>
  // </ListItem>
}

export default SearchableItemPlaceholder
