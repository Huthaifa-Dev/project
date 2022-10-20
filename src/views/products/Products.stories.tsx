import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Products from "./index";

import { Provider } from "react-redux";
import { store } from "../../redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";

export default {
  title: "Views/Products",
  component: Products,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Products>;

const AppWrapper = (args) => (
  <Provider store={store}>
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Products {...args} />} />
      </Routes>
    </MemoryRouter>
  </Provider>
);

const Template: ComponentStory<typeof AppWrapper> = (args) => (
  <AppWrapper {...args} />
);

export const addProductform = Template.bind({});
