import React from "react";
import Horizantal from "../../layout/Horizantal/";
import Checkout from "./Checkout";

import "./Home.scss";
import POSPage from "./POS";
const Home: React.VFC = () => {
  return (
    <Horizantal>
      <div className="homepage">
        <POSPage />
        <Checkout />
      </div>
    </Horizantal>
  );
};

export default Home;
