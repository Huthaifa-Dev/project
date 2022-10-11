import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Form from "./Form";

export default {
  title: "Components/ProductForm",
  component: Form,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Form>;

const Template: ComponentStory<typeof Form> = (args) => <Form {...args} />;

export const addCategoryData = Template.bind({});
