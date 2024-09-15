import {useState} from "react";
import {
  Box,
  Divider,
  List,
  TextField,
  Toolbar
} from "@mui/material";
import {SearchableFC} from "./Searchable.tsx";
import {useAutoAnimate} from "@formkit/auto-animate/react";

const ScrollableSearchable: SearchableFC = props => {
  const [animationParent] = useAutoAnimate();
  const [searchQueryText, setSearchQueryText] = useState('');

  const productListQueries = props.useSearchQuery({
    searchText: searchQueryText,
    limit: Infinity,
    offset: 0,
    ...props.additionalSearchQueryProps,
  } as any);


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
        return props.renderItem(entityId);
      })}
    </List>
  </>
}

export default ScrollableSearchable;

// const Page: FC<{
//   limit: number;
//   offset: number;
//   searchQueryText: string;
//   parentProps: SearchableProps<any>;
//   requestNextPage?: () => void;
// }> = props => {
//   const {requestNextPage, limit, offset} = props;
//   const [lastItem, setLastItem] = useState<HTMLDivElement | null>(null);
//
//   useEffect(() => {
//     if (!lastItem) return;
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting) requestNextPage?.();
//     });
//
//     observer.observe(lastItem);
//     return () => observer.disconnect()
//   }, [lastItem, requestNextPage])
//
//   const productListQuery = props.parentProps.useSearchQuery({
//     searchText: props.searchQueryText,
//     limit,
//     offset,
//     ...props.parentProps.additionalSearchQueryProps,
//   });
//
//   if (productListQuery.isPending) {
//     return <ListItem>
//       <Skeleton/>
//     </ListItem>
//   }
//
//   if (productListQuery.isError) {
//     return <ListItem>Error</ListItem>
//   }
//
//   return <>
//     {productListQuery.data.items.map(item => props.parentProps.renderItem(item))}
//     {props.requestNextPage && productListQuery.data.totalCount > (limit + offset) && (
//       <div ref={setLastItem}></div>
//     )}
//   </>
// }
