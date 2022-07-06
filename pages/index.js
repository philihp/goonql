import useSWR from "swr";
import { gql } from "graphql-tag";

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

const query = gql`
  {
    types {
      id
      name
    }
  }
`;

export default function Index() {
  const { data, error } = useSWR(query, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const { users } = data;

  return (
    <div>
      {users.map(({ id, name }) => (
        <div key={id}>
          {id} {name}
        </div>
      ))}
    </div>
  );
}
