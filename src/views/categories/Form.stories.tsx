import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Form from "./Form";
import { store } from "../../redux";
import { Provider } from "react-redux";

export default {
  title: "Components/Form",
  component: Form,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Form>;

const AppWrapper = (args) => (
  <Provider store={store}>
    <Form {...args} />
  </Provider>
);

const Template: ComponentStory<typeof AppWrapper> = (args) => (
  <AppWrapper {...args} />
);

export const addCategoryData = Template.bind({});
