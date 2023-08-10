import React, { useState } from "react";

const usePegnate = () => {
  const [page, setPage] = useState({
    start: 0,
    end: 5,
    pegnate: 5,
  });
  const pegnate = (e) => {
    const { value } = e.target;
    const start = 0;
    const end = value;
    console.log(value, start, end);
    setPage((prev) => ({ ...prev, start, end }));
  };

  const nextPage = () => {
    // setPage((prev) => ({...prev,start:prev});
  }
  const prevPage = () => {}


  return { page, pegnate };
};

export default usePegnate;
