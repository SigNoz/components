import React from "react";
import { Story, Meta } from "@storybook/react";
import { Badge } from "@signozhq/badge";

export default {
  title: "Components/Badge",
  component: () => <Badge variant="destructive">Destructive</Badge>,
} as Meta;

const Template: Story = () => <Badge variant="destructive">Destructive</Badge>;

export const Default = Template.bind({});
Default.args = {
  // Add default props here
};
