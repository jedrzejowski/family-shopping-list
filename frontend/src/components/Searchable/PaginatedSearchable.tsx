import {useLayoutEffect, useState} from "react";
import {Box, Divider, List, Pagination, Skeleton, TextField, Toolbar} from "@mui/material";
import type {SearchableFC} from "./Searchable.tsx";

const PaginatedSearchable: SearchableFC = props => {
  const [searchQueryText, setSearchQueryText] = useState('');
  const pageSize = 10; // const [pageSize, setPageSize] = useState<number>(10);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const productListQuery = props.useSearchQuery({
    searchText: searchQueryText,
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
    ...props.additionalSearchQueryProps,
  } as Parameters<typeof props.useSearchQuery>[0]);

  useLayoutEffect(() => {
    const totalCount = productListQuery.data?.totalCount;

    if (typeof totalCount === 'number') {
      if (totalCount === 0) {
        setPageCount(1);
      } else {
        setPageCount(Math.ceil(totalCount / pageSize));
      }
    } else {
      setPageCount(null);
    }

  }, [productListQuery.data?.totalCount, pageSize]);

  useLayoutEffect(() => {
    setPageNumber(1);
  }, [searchQueryText]);

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

    <Divider/>

    <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>

      {pageCount ? (
        <Pagination
          page={pageNumber}
          onChange={(_event, page) => setPageNumber(page)}
          count={pageCount}
          color="primary"
        />
      ) : (
        <Skeleton sx={{width: '50%'}}/>
      )}
    </Box>
  </>
}

export default PaginatedSearchable;
