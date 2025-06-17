import { styled } from '@mui/material/styles';
import { Button as DefaultButton, ButtonProps as DefaultButtonProps } from '@mui/material';

export interface ButtonProps extends DefaultButtonProps {}

export const Button = styled(DefaultButton)<ButtonProps>(({ theme }) => ({
  backgroundColor: '#0063cc',
  textTransform: 'initial',
  variants: [
    {
      props: { variant: 'contained' },
      style: {
        color: '#F8F8FF',
        fontWeight: '500',
        backgroundColor: '#D876A9',
        padding: '10px',
        fontSize: '16px',
        lineHeight: '19.2px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: '#DF8DB8'
        },
        '&:active': {
          backgroundColor: '#C967A2'
        },
        '&:disabled': {
          backgroundColor: '#A1999F',
          color: '#F8F8FF'
        },
        [theme.breakpoints.down('md')]: {
          fontSize: '14px',
          fontWeight: '400',
          borderRadius: '4px',
          padding: '6px'
        }
      }
    },
    {
      props: { variant: 'outlined' },
      style: {
        // color: '#C967A2',
        color: '#D27BAE',
        fontWeight: '500',
        backgroundColor: 'white',
        padding: '8px',
        border: '2px solid #D876A9',
        fontSize: '16px',
        lineHeight: '19.2px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        '&:hover': {
          color: '#C967A2',
          gap: '12px',
          border: '2px solid #C967A2'
        },
        '&:active': {
          color: '#804595'
        },
        '&:disabled': {
          color: '#A1999F',
          border: '2px solid #A1999F',
          backgroundColor: '#AEAEB3'
        },
        [theme.breakpoints.down('md')]: {
          border: '1px solid #C967A2',
          fontSize: '14px',
          fontWeight: '400',
          borderRadius: '4px',
          padding: '6px'
        }
      }
    }
  ]
}));
