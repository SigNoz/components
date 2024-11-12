import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@signozhq/button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "danger", "warning", "default", "ghost", "link"],
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
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
    children: "Button",
    variant: "primary",
    size: "default",
    theme: "light",
    asChild: false,
    onClick: () => {
      alert("It works!");
    },
  },
};

export const Default: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...Primary.args,
    children: "Default",
    variant: "default",
  },
};

export const Large: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...Primary.args,
    children: "Large",
    size: "lg",
  },
};

export const Small: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...Primary.args,
    children: "Small",
    size: "sm",
  },
};

export const Dark: Story = {
  render: (args) => <Button {...args} />,
  args: {
    ...Primary.args,
    children: "Dark Theme",
    theme: "dark",
  },
};
