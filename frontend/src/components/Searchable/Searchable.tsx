import {ReactElement, ReactNode} from "react";
import PaginatedSearchable from "./PaginatedSearchable.tsx";
import {useIsMobileLayout} from "../../mui-theme.tsx";
import ScrollableSearchable from "./ScrollableSearchable.tsx";
import {UseSearchQueries, UseSearchQuery} from "../../state/repo/searchQuery.ts";


export interface SearchableProps<UseSearchQueryProps extends object = object> {
  useSearchQuery: UseSearchQuery<UseSearchQueryProps>;
  useSearchQueries: UseSearchQueries<UseSearchQueryProps>;
  renderItem: (entityId: string) => ReactNode;
  additionalSearchQueryProps?: UseSearchQueryProps;
  toolbarActions?: ReactNode;
  initialPageSize?: number;
}

export interface SearchableFC {
  <UseSearchQueryProps extends object = object>(props: SearchableProps<UseSearchQueryProps>): ReactElement;
}

const Searchable: SearchableFC = props => {
  const isMobileLayout = useIsMobileLayout();

  if (isMobileLayout) {
    return <ScrollableSearchable {...props}/>
  } else {
    return <PaginatedSearchable {...props}/>
  }
}

export default Searchable;
