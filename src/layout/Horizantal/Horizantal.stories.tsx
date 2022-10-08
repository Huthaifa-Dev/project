import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Blank from ".";
import { MemoryRouter, Route, Routes } from "react-router-dom";
const Default = (args: any) => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/*" element={<Blank {...args} />} />
      </Routes>
    </MemoryRouter>
  );
};
export default {
  title: "Layout/Horizantal",
  component: Default,
} as ComponentMeta<typeof Default>;

const Template: ComponentStory<typeof Default> = (args) => (
  <Default {...args} />
);

export const Page = Template.bind({});
