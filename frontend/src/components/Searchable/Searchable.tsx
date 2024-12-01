import {ReactNode} from "react";
import PaginatedSearchable from "./PaginatedSearchable.tsx";
import {useIsMobileLayout} from "../../mui-theme.tsx";
import ScrollableSearchable from "./ScrollableSearchable.tsx";
import {UseSearchQueries, UseSearchQuery} from "../../state/repo/searchQuery.ts";


export interface SearchableProps<
  UseSearchQueryProps extends object
> {
  useSearchQuery: UseSearchQuery<UseSearchQueryProps>;
  useSearchQueries: UseSearchQueries<UseSearchQueryProps>;
  renderItem: (entityId: string) => ReactNode;
  additionalSearchQueryProps?: UseSearchQueryProps;
  toolbarActions?: ReactNode;
  initialPageSize?: number;
}

function Searchable<UseSearchQueryProps extends object>(
  props: SearchableProps<UseSearchQueryProps>
) {
  const isMobileLayout = useIsMobileLayout();

  if (isMobileLayout) {
    return <ScrollableSearchable {...props}/>
  } else {
    return <PaginatedSearchable {...props}/>
  }
}

export default Searchable;
