import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../Button/Button";
import "./Search.scss";
interface Props {
  fullWidth?: boolean;
}
export const Search: React.FC<Props> = ({ fullWidth }) => {
  const { register, watch, setValue } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const search = watch("search");

  const classes = `form-control ${fullWidth ? "form-control--full-width" : ""}`;
  const handleSearchButton = () => {
    if (search.length !== 0) {
      setValue("search", "");
    }
  };
  return (
    <div className="search">
      <input className={classes} {...register("search", {})} />
      <Button onClick={handleSearchButton}>{search ? "❌" : "🔍"}</Button>
    </div>
  );
};

export default Search;
