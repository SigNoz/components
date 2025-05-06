// import React from 'react';
// import type { Meta, StoryObj } from '@storybook/react';
// import { ToggleGroup, ToggleGroupItem } from '@signozhq/toggle-group';
// import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

// type ToggleGroupProps = React.ComponentProps<typeof ToggleGroup>;

// const meta: Meta<typeof ToggleGroup> = {
//   title: 'Components/ToggleGroup',
//   component: ToggleGroup,
//   argTypes: {
//     type: {
//       control: 'radio',
//       options: ['single', 'multiple'],
//       defaultValue: 'single',
//     },
//     variant: {
//       control: 'radio',
//       options: ['default', 'outline'],
//       defaultValue: 'outline',
//     },
//     size: {
//       control: 'radio',
//       options: ['default', 'sm', 'lg'],
//       defaultValue: 'default',
//     },
//     disabled: {
//       control: 'boolean',
//       defaultValue: false,
//     },
//   },
//   parameters: {
//     design: [
//       {
//         name: 'Figma',
//         type: 'figma',
//         url: 'https://www.figma.com/file/your-figma-url-here',
//       },
//     ],
//   },
// };

// export default meta;
// type Story = StoryObj<typeof ToggleGroup>;

// // Single selection example (Text alignment)
// export const SingleChoice: Story = {
//   render: (args: ToggleGroupProps) => (
//     <ToggleGroup
//       type="single"
//       defaultValue="center"
//       variant="outline"
//       {...args}
//     >
//       <ToggleGroupItem value="left" aria-label="Align left">
//         <AlignLeft className="h-3 w-3" />
//       </ToggleGroupItem>
//       <ToggleGroupItem value="center" aria-label="Align center">
//         <AlignCenter className="h-3 w-3" />
//       </ToggleGroupItem>
//       <ToggleGroupItem value="right" aria-label="Align right">
//         <AlignRight className="h-3 w-3" />
//       </ToggleGroupItem>
//       <ToggleGroupItem value="justify" aria-label="Justify">
//         <AlignJustify className="h-3 w-3" />
//       </ToggleGroupItem>
//     </ToggleGroup>
//   ),
// };

// // Multiple selection example (Text formatting)
// export const MultipleChoices: Story = {
//   render: (args: ToggleGroupProps) => (
//     <ToggleGroup
//       type="multiple"
//       variant="outline"
//       defaultValue={["bold"]}
//       {...args}
//     >
//       <ToggleGroupItem value="bold" aria-label="Bold">
//         <Bold className="h-3 w-3" />
//       </ToggleGroupItem>
//       <ToggleGroupItem value="italic" aria-label="Italic">
//         <Italic className="h-3 w-3" />
//       </ToggleGroupItem>
//       <ToggleGroupItem value="underline" aria-label="Underline">
//         <Underline className="h-3 w-3" />
//       </ToggleGroupItem>
//     </ToggleGroup>
//   ),
// };

// // Example with text labels
// export const WithLabels: Story = {
//   render: (args: ToggleGroupProps) => (
//     <ToggleGroup
//       type="single"
//       defaultValue="month"
//       variant="outline"
//       {...args}
//     >
//       <ToggleGroupItem value="day">
//         Day
//       </ToggleGroupItem>
//       <ToggleGroupItem value="week">
//         Week
//       </ToggleGroupItem>
//       <ToggleGroupItem value="month">
//         Month
//       </ToggleGroupItem>
//     </ToggleGroup>
//   ),
// };
