import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Checkout from "./Checkout";

import { Provider } from "react-redux";
import { store } from "../../redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Views/Home/Checkout",
  component: Checkout,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Checkout>;

const AppWrapper = (args) => (
  <Provider store={store}>
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Checkout {...args} />} />
      </Routes>
    </MemoryRouter>
  </Provider>
);

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AppWrapper> = (args) => (
  <div className="homepage">
    <AppWrapper {...args} />
  </div>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
