// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';

// export const Tabbar = Tabs;
// export const TabItem = Tab;
// atoms/Tabbar.tsx
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';

// Styled Tabs
export const Tabbar = styled(Tabs)(({ theme }) => ({
  minHeight: '32px',
  '& .MuiTabs-flexContainer': {
    minHeight: '32px',
    alignItems: 'center',

    [theme.breakpoints.down('sm')]: {
      minHeight: '28px'
    }
  }
}));

// Styled Tab
export const TabItem = styled(Tab)(({ theme }) => ({
  minHeight: '32px',
  padding: '6px 8px',
  marginRight: '12px',
  fontSize: '0.75rem',
  fontWeight: 500,
  textTransform: 'initial',
  textUnderlineOffset: '6px',
  color: '#A1999F',

  '&.Mui-selected': {
    color: '#C967A2',
    textDecoration: 'underline'
  },

  [theme.breakpoints.down('sm')]: {
    padding: '4px 6px',
    fontSize: '0.65rem',
    marginRight: '8px',
    minWidth: '50px'
  }
}));
