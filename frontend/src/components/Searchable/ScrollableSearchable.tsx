/* eslint-disable  @typescript-eslint/no-explicit-any */
import {FC, useCallback, useEffect, useLayoutEffect, useState} from "react";
import {
  Box,
  Divider,
  List, ListItem,
  Skeleton,
  TextField,
  Toolbar
} from "@mui/material";
import {SearchableFC, SearchableProps} from "./Searchable.tsx";
import {TransitionGroup} from 'react-transition-group';

const ScrollableSearchable: SearchableFC = props => {
  const [pageSize] = useState(props.initialPageSize ?? 10);
  const [searchQueryText, setSearchQueryText] = useState('');
  const [pages, setPages] = useState<{ limit: number; offset: number }[]>([]);

  useLayoutEffect(() => {
    setPages([{offset: 0, limit: pageSize}]);
  }, [searchQueryText]);


  const loadNextPage = useCallback(() => {
    setPages(pages => {
      let offset = 0;
      for (const page of pages) offset += page.limit;
      return [...pages, {limit: pageSize, offset}];
    })
  }, []);


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

    <List>
      <TransitionGroup>
        {pages.map((page, i) => {
          return <Page
            key={i}
            searchQueryText={searchQueryText}
            limit={page.limit}
            offset={page.offset}
            parentProps={props}
            requestNextPage={i === pages.length - 1 ? loadNextPage : undefined}
          />
        })}
      </TransitionGroup>
    </List>
  </>
}

export default ScrollableSearchable;

const Page: FC<{
  limit: number;
  offset: number;
  searchQueryText: string;
  parentProps: SearchableProps<any>;
  requestNextPage?: () => void;
}> = props => {
  const {requestNextPage, limit, offset} = props;
  const [lastItem, setLastItem] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lastItem) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) requestNextPage?.();
    });

    observer.observe(lastItem);
    return () => observer.disconnect()
  }, [lastItem, requestNextPage])

  const productListQuery = props.parentProps.useSearchQuery({
    searchText: props.searchQueryText,
    limit,
    offset,
    ...props.parentProps.additionalSearchQueryProps,
  } as Parameters<typeof props.parentProps.useSearchQuery>[0]);

  if (productListQuery.isPending) {
    return <ListItem>
      <Skeleton/>
    </ListItem>
  }

  if (productListQuery.isError) {
    return <ListItem>Error</ListItem>
  }

  return <>
    {productListQuery.data.items.map(item => props.parentProps.renderItem(item))}
    {props.requestNextPage && productListQuery.data.totalCount > (limit + offset) && (
      <div ref={setLastItem}></div>
    )}
  </>
}
