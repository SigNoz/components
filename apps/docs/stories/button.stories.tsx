import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@signozhq/button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "danger", "warning", "secondary", "ghost", "link", "solid", "dashed"],
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg"],
    },
    theme: {
      control: { type: "select" },
      options: ["light", "dark"],
    },
    asChild: {
      control: { type: "boolean" },
    },
  },
  parameters: {
    design: [
      {
        name: "Figma",
        type: "figma",
        url: "https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-739",
      },
      {
        name: "Spec",
        type: "figma",
        url: "https://www.figma.com/board/uJOS4p4BNG1rLryBceR3YV/Untitled?node-id=6-155&t=2rVCYOnxaIjupEqA-4",
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  render: (args) => <Button {...args} />,
  args: {
    children: "Big Button 1",
    variant: "primary",
    size: "xs",
    theme: "light",
    asChild: false,
    onClick: () => {
      alert("It works!");
    },
  },
};

export const Secondary: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...Primary.args,
    children: "Big Button 1",
    variant: "secondary",
  },
};

export const Warning: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...Primary.args,
    children: "Big Button 1",
    variant: "warning",
  },
};

export const Danger: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...Primary.args,
    children: "Big Button 1",
    variant: "danger",
  },
};

export const Link: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...Primary.args,
    children: "Big Button 1",
    variant: "link",
  },
};

export const Ghost: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...Primary.args,
    children: "Big Button 1",
    variant: "ghost",
  },
};

export const Solid: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...Primary.args,
    children: "Big Button 1",
    variant: "solid",
  },
};

export const Dashed: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...Primary.args,
    children: "Big Button 1",
    variant: "dashed",
  },
};