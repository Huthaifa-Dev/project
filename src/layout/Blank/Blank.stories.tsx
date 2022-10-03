import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Blank from ".";

export default {
  title: "Layout/Blank",
  component: Blank,
} as ComponentMeta<typeof Blank>;

const Template: ComponentStory<typeof Blank> = (args) => <Blank {...args} />;

export const Page = Template.bind({});
