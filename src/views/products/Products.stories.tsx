import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Products } from "./Products";

export default {
  title: "Pages/Products",
  component: Products,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Products>;

const Template: ComponentStory<typeof Products> = (args) => (
  <Products {...args} />
);

export const LoggedOut = Template.bind({});

export const LoggedIn = Template.bind({});

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
LoggedIn.play = async ({ canvasElement }) => {};
