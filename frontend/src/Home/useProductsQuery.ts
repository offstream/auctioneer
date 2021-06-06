import { useQuery } from "react-query";

import { client } from "../shared/apiClient";

type ProductOwner = {
  email: string;
  username: string;
};

export type ProductItem = {
  id: number;
  name: string;
  description: string;
  image: string; // image url
  min_price: string; //convert to decimal
  max_price: string; //contert to decimal
  expiry_date: string; //convert to DateTime
  product_owner: ProductOwner;
};

type FetchProductsResponse = {
  next: null | string;
  previous: null | string;
  results: ProductItem[];
};

const fetchProducts = () => client.get("products/").then(res => res.data);

export const usePosts = () => {
  return useQuery<FetchProductsResponse, Error>("posts", fetchProducts);
};
