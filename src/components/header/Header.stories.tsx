import React from "react";
import { MemoryRouter, Routes, Route } from "react-router";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Header from "./HeaderComponent";

const headerProps = {
  user: {},
  onLogin: () => {},
  onLogout: () => {},
};
const Default = (args: any) => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/*" element={<Header {...headerProps} {...args} />} />
      </Routes>
    </MemoryRouter>
  );
};
export default {
  title: "Components/Header",
  component: Default,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Default>;

const Template: ComponentStory<typeof Default> = (args) => (
  <Default {...args} />
);

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {
    username: "Jane Doe",
  },
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
