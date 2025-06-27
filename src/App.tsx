import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

type DataType = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

function App() {
  const [id, setId] = useState(1);

  const getComments = async (id: number): Promise<DataType[]> => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/comments?postId=${id}`
    );
    return response.json();
  };

  // isLoading - When it fecthes for the first time
  // isPending - When there is no data in the cache
  // isFetching - On every fetch, first time, from cache, any time it fetches
  const { data, isPending, refetch, error } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getComments(id),
    staleTime: 1000 * 60 * 5, // 5 minutes - time to GET the data in the cache, after that it will call the queryFn again
  });

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : (
        data?.slice(0, 10)?.map((comment) => (
          <div
            key={comment.id}
            style={{
              border: "1px solid black",
              padding: "10px",
              margin: "10px",
            }}
          >
            <span>{comment.name}</span>
            <span>{comment.email}</span>
            <span>{comment.body}</span>
          </div>
        ))
      )}
      <button onClick={() => setId((prev) => prev - 1)} disabled={id === 1}>
        Previous
      </button>
      <button onClick={() => setId((prev) => prev + 1)} disabled={id === 10}>
        Next
      </button>
      <br />
      <hr />
      <button onClick={() => refetch()}>Refetch</button>
    </div>
  );
}

export default App;
