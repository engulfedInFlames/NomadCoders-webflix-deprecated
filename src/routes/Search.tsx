import { useSearchParams } from "react-router-dom";

function Search() {
  const [searchParams, _] = useSearchParams();
  console.log(searchParams.get("keyword")); // searchParams는 JS의 URLSearchParams의 인스턴스이다.
  return <></>;
}

export default Search;
