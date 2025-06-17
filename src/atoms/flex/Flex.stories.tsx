import type { Meta, StoryObj } from '@storybook/react';

import { Flex } from './Flex';
import { Box, BoxProps } from '..';

type PagePropsAndCustomArgs = React.ComponentProps<typeof Flex> & BoxProps;

const meta: Meta<PagePropsAndCustomArgs> = {
  component: Flex,
  render: ({ ...args }) => (
    <Flex {...args}>
      <Box width={'100px'} border={'1px solid blue'}>
        Box 1
      </Box>
      <Box width={'100px'} border={'1px solid green'}>
        Box 2
      </Box>
    </Flex>
  )
};
export default meta;

type Story = StoryObj<PagePropsAndCustomArgs>;

export const SimpleFlex: Story = {
  args: {
    width: '400px',
    height: '200px',
    border: '1px solid red',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
};
