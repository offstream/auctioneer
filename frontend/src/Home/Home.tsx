import React from "react";

import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { usePosts, ProductItem } from "./useProductsQuery";

dayjs.extend(relativeTime);

const Product = (props: ProductItem) => {
  const dateObj = dayjs(props.expiry_date);
  const dateDiff = dateObj.fromNow();
  const isExpired = dayjs().isAfter(dateObj);
  return (
    <>
      <img
        style={{
          height: "100%",
          maxHeight: "14rem",
          minHeight: "12rem",
          width: "12rem",
          backgroundColor: "#513B56",
          objectFit: "contain",
          alignSelf: "center",
        }}
        src={props.image}
        alt={props.name}
      />
      <div style={{ margin: "1rem" }}>
        <h1>
          <Link to={`/product/${props.id}/`}>{props.name}</Link>
        </h1>
        <p>PHP {props.min_price}</p>
        <p>??? bids</p>
        <p>(PHP {props.max_price} max)</p>
        <p>{`${isExpired ? "ended" : "ends"} ${dateDiff}`}</p>
      </div>
    </>
  );
};

const Home = () => {
  const productsQuery = usePosts();
  return (
    <>
      {productsQuery.isLoading ? (
        <span>Loading...</span>
      ) : productsQuery.isError ? (
        <span>{productsQuery.error!.message}</span>
      ) : (
        <ul
          style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          {productsQuery.data!.results.map(product => (
            <li
              key={`product-${product.id}`}
              style={{
                display: "flex",
                margin: "1.5rem 0.75rem 0",
                boxShadow: "0 2px 6px #4444",
                minWidth: "36rem",
              }}
            >
              <Product {...product} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export const HOME_ROUTE = {
  path: "home",
  element: <Home />,
};
