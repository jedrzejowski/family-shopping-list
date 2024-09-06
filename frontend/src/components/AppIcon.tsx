import type {FC} from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type {SvgIconOwnProps} from "@mui/material/SvgIcon/SvgIcon";
import {colors} from "@mui/material";

export type AppIconName =
  | 'delete'
  | 'edit'
  | 'add'

const AppIcon: FC<SvgIconOwnProps & {
  name: AppIconName;
}> = props => {
  const {name, ...rest} = props;
  const iconProps = {...rest};

  let Component: FC<SvgIconOwnProps>

  switch (name) {
    case "edit":
      Component = EditIcon;
      break
    case "delete":
      Component = DeleteIcon;
      iconProps.sx = {
        ...iconProps.sx,
        color: colors.red[500],
      }
      break;
    case "add":
      Component = AddIcon;
      break;
    default:
      throw new Error('unknown icon');
  }

  return <Component {...iconProps}/>
}

export default AppIcon;
