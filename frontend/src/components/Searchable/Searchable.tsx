import {ReactElement, ReactNode} from "react";
import {UseSearchQuery} from "../../state/_createRepo.tsx";
import PaginatedSearchable from "./PaginatedSearchable.tsx";
import {useIsMobileLayout} from "../../mui-theme.tsx";
import ScrollableSearchable from "./ScrollableSearchable.tsx";

export interface SearchableFC {
  <UseSearchQueryProps extends object = object>(props: {
    useSearchQuery: UseSearchQuery<UseSearchQueryProps>;
    renderItem: (entityId: string) => ReactNode;
    additionalSearchQueryProps?: UseSearchQueryProps;
    toolbarActions?: ReactNode;
  }): ReactElement;
}

export interface SearchableProps<UseSearchQueryProps extends object = object> {
  useSearchQuery: UseSearchQuery<UseSearchQueryProps>;
  renderItem: (entityId: string) => ReactNode;
  additionalSearchQueryProps?: UseSearchQueryProps;
  toolbarActions?: ReactNode;
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
