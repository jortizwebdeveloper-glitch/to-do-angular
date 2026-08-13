import type { Meta, StoryObj } from '@storybook/angular';

import { Navaside } from './navaside';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<Navaside> = {
  title: 'Molecules/Navaside',
  component: Navaside,
  tags: ['autodocs'],
//   argTypes: {
//     backgroundColor: {
//       control: 'color',
//     },
//   },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
};

export default meta;
type Story = StoryObj<Navaside>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
