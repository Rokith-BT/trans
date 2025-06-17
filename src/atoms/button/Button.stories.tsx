import type { Meta, StoryObj } from '@storybook/react';

import { Button, ButtonProps } from './Button';

type PagePropsAndCustomArgs = React.ComponentProps<typeof Button> & ButtonProps & { content?: string };

const meta: Meta<PagePropsAndCustomArgs> = {
  component: Button,
  render: ({ content, ...args }) => <Button {...args}>{content}</Button>
};
export default meta;

type Story = StoryObj<PagePropsAndCustomArgs>;

export const PrimaryButton: Story = {
  args: {
    content: 'Simple Button',
    variant: 'contained',
    disableRipple: true,
    fullWidth: false,
    disabled: false
  }
};

export const SecondaryButton: Story = {
  args: {
    content: 'Simple Button',
    variant: 'outlined',
    disableRipple: true,
    fullWidth: false,
    disabled: false
  }
};
