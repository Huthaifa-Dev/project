import React from "react";

import "./Horizantal.scss";

interface Props {
  children: React.ReactNode;
}

const Blank: React.FC<Props> = ({ children }) => {
  return <div className="wrapper">{children}</div>;
};

export default Blank;
