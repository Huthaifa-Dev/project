import React from "react";

import "./Blank.scss";

interface Props {
  children: React.ReactNode;
}

const Blank: React.FC<Props> = ({ children }) => {
  return <div className="blank-layout">{children}</div>;
};

export default Blank;
