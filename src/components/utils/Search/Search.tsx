import React, { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../Button/Button";
import "./Search.scss";
interface Props {
  fullWidth?: boolean;
  forwardChange: () => void;
}
export const Search = forwardRef<HTMLInputElement, Props>(
  ({ fullWidth, forwardChange }, ref) => {
    const [search, setSearch] = useState("");

    const classes = `form-control ${
      fullWidth ? "form-control--full-width" : ""
    }`;
    const handleSearchButton = () => {
      if (search.length !== 0) {
        setSearch("");
      }
    };
    return (
      <div className="search">
        <input
          name="search"
          placeholder="Search"
          className={classes}
          ref={ref}
          onChange={(e) => {
            setSearch((prev) => e.target.value);
            forwardChange();
          }}
        />
        <Button backgroundColor="white" onClick={handleSearchButton}>
          {search !== "" ? "❌" : "🔍"}
        </Button>
      </div>
    );
  },
);
Search.displayName = "Search";

export default Search;
