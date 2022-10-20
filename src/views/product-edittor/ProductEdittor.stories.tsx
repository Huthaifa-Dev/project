import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import ProductEditor from "./index";

import { Provider } from "react-redux";
import { store } from "../../redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";

export default {
  title: "Views/ProductEditor",
  component: ProductEditor,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof ProductEditor>;

const AppWrapper = (args) => (
  <Provider store={store}>
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<ProductEditor {...args} />} />
      </Routes>
    </MemoryRouter>
  </Provider>
);

const Template: ComponentStory<typeof AppWrapper> = (args) => (
  <AppWrapper {...args} />
);

export const addProductform = Template.bind({});
