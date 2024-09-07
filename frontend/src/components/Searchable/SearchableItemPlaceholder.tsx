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
}

export default SearchableItemPlaceholder
