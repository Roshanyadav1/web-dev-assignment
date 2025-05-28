"use client";

type SearchProps = {
  query: string;
  queryHandler: (value: string) => void;
};

export default function Search({ query, queryHandler }: SearchProps) {
  return (
    <input
      type="search"
      value={query}
      onChange={(e) => queryHandler(e.target.value)}
      placeholder="Search projects..."
      className="w-full max-w-md p-2 border rounded-md"
    />
  );
}
