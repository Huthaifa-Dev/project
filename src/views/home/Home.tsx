import React from "react";
import Horizantal from "../../layout/Horizantal/";

type Props = {
  children?: React.ReactNode;
};

const Home: React.VFC<Props> = ({ children }) => {
  return <Horizantal>{children}</Horizantal>;
};

export default Home;
