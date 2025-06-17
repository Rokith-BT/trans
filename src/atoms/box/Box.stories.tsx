import type { Meta, StoryObj } from '@storybook/react';

import { Box } from './Box';

type PagePropsAndCustomArgs = React.ComponentProps<typeof Box>;

const meta: Meta<PagePropsAndCustomArgs> = {
  component: Box,
  render: ({ ...args }) => <Box {...args}></Box>
};
export default meta;

type Story = StoryObj<PagePropsAndCustomArgs>;

export const SimpleBox: Story = {
  args: {
    width: '200px',
    height: '200px',
    border: '1px solid red'
  }
};
