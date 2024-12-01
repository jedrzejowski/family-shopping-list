import {Fragment, useState} from "react";
import {
  Box,
  Divider,
  List,
  TextField,
  Toolbar
} from "@mui/material";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {SearchableProps} from "./Searchable.tsx";

function ScrollableSearchable<UseSearchQueryProps extends object>(
  props: SearchableProps<UseSearchQueryProps>
) {
  const [animationParent] = useAutoAnimate();
  const [searchQueryText, setSearchQueryText] = useState('');

  const productListQueries = props.useSearchQuery({
    searchText: searchQueryText,
    limit: Infinity,
    offset: 0,
    ...props.additionalSearchQueryProps as UseSearchQueryProps,
  });

  return <>
    <Toolbar sx={{display: 'flex'}} disableGutters>
      <TextField
        label="Szukaj"
        value={searchQueryText}
        onChange={event => setSearchQueryText(event.target.value)}
      />

      <Box sx={{flex: 1}}>

      </Box>

      {props.toolbarActions}

    </Toolbar>

    <Divider sx={{mt: 1}}/>

    <List ref={animationParent}>
      {productListQueries.data?.items?.map((entityId) => {
        return <Fragment key={entityId}>{props.renderItem(entityId)}</Fragment>;
      })}
    </List>
  </>
}

export default ScrollableSearchable;
