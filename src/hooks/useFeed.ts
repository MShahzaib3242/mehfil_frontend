import { useQuery } from "@tanstack/react-query";
import { getFeed } from "../api/feedApi";

export const useFeed = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: getFeed,
  });
};
