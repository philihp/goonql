import useSWR from "swr";
import { gql } from "graphql-tag";

const query = gql`
  {
    types {
      id
      name
    }
  }
`;

const fetcher = (query) =>
  fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data);

export default function Index() {
  const { data, error } = useSWR(query, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const { types } = data;

  return (
    <div>
      {types.map((type) => (
        <div key={type.id}>
          {type.id} {type.name}
        </div>
      ))}
    </div>
  );
}
