import { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from "@signozhq/alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
    },
    title: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

const Template: Story = {
  render: ({ variant, title, children }) => (
    <Alert variant={variant}>
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  ),
};

export const Default: Story = {
  ...Template,
  args: {
    variant: "default",
    title: "Heads up!",
    children:
      "You can add components and dependencies to your app using the cli.",
  },
};

export const Destructive: Story = {
  ...Template,
  args: {
    variant: "destructive",
    title: "Error",
    children: "Your session has expired. Please log in again.",
  },
};

export const TitleOnly: Story = {
  ...Template,
  args: {
    title: "Note",
    children: null,
  },
};

export const DescriptionOnly: Story = {
  ...Template,
  args: {
    title: "",
    children: "This is a description-only alert.",
  },
};
