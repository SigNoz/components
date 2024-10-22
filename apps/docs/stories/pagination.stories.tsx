import type { Meta, StoryObj } from "@storybook/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@signozhq/pagination";

const PaginationComponent = () => (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="#" onClick={(e) => e.preventDefault()} />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
          1
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#" onClick={(e) => e.preventDefault()} isActive>
          2
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
          3
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href="#" onClick={(e) => e.preventDefault()} />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
);

const meta: Meta<typeof PaginationComponent> = {
  title: "Components/Pagination",
  component: PaginationComponent,
  argTypes: {},
  parameters: {
    backgrounds: {
      default: "dark",
    },
    design: [
      {
        name: "Figma",
        type: "figma",
        url: "https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=40-1657&node-type=frame&t=RGQXgBfSXKWsYAz9-0",
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof PaginationComponent>;

export const Default: Story = {
  render: () => <PaginationComponent />,
  args: {},
};
