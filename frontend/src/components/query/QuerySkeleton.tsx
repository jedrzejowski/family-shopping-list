import {ReactNode} from "react";
import {UseQueryResult} from "@tanstack/react-query";

function QuerySkeleton<Data>(props: {
  query: UseQueryResult<Data, unknown>;
  render: (data: Data) => ReactNode;
}): ReactNode {

  if (props.query.isPending) {
    return <div>Loading</div>
  }

  if (props.query.isError) {
    return <div>Error</div>
  }

  return props.render(props.query.data);
}

export default QuerySkeleton;
