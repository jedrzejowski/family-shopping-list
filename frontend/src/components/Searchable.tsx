import {ReactNode, useState} from "react";
import {UseQueryResult} from "@tanstack/react-query";
import * as model from '../model.ts';
import {Box, Divider, List, TextField, Toolbar} from "@mui/material";

function Searchable<
  UseSearchQueryProps extends {
    searchText: string;
    limit: number;
    offset: number;
  },
>(props: {
  useSearchQuery: (args: UseSearchQueryProps) => UseQueryResult<model.SearchResult<string>>;
  renderItem: (entityId: string) => ReactNode;
  additionalSearchQueryProps?: Omit<UseSearchQueryProps, "searchText" | "offset" | "limit">;
  toolbarActions?: ReactNode;
}) {

  const [searchQueryText, setSearchQueryText] = useState('');
  const productListQuery = props.useSearchQuery({
    searchText: searchQueryText,
    limit: 10,
    offset: 0,
    ...props.additionalSearchQueryProps,
  } as UseSearchQueryProps);

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

    {productListQuery.isPending ? (
      <div>Loading</div>
    ) : productListQuery.isError ? (
      <div>Error</div>
    ) : (
      <List>
        {productListQuery.data.items.map(item => props.renderItem(item))}
      </List>
    )}
  </>
}

export default Searchable
