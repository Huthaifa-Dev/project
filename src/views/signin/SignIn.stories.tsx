import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SignIn from "./SignIn";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Viwes/SignIn",
  component: SignIn,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof SignIn>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SignIn> = (args) => <SignIn {...args} />;

export const Page = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
