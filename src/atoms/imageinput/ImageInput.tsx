import React from 'react';
import { TextField, TextFieldVariants, styled } from '@mui/material';

// Custom styled component extending TextField
const ImageInput = styled(TextField)(({}) => ({
  '& .MuiInputBase-input': {
    height: 'auto', // Allow the input height to adjust based on content
    display: 'flex',
    alignItems: 'center',
    gap: '5px', // Adjust spacing between images
    flexWrap: 'wrap' // Allow images to wrap if needed
  },
  '& .MuiInputBase-root': {
    borderRadius: '8px',
    '&:hover': {}
  },
  '& .MuiInputLabel-root': {
    color: '#A1999F',
    fontSize: '16px'
  },
  '.MuiInputLabel-shrink': {
    color: '#1A0616',
    fontWeight: '500'
  },
  '.MuiInputLabel-asterisk': {
    color: 'red'
  },
  '.MuiOutlinedInput-notchedOutline': {
    borderColor: '#804595'
  },
  '.MuiFormHelperText-root': {
    color: '#A1999F',
    fontSize: '13px',
    letterSpacing: '0px'
  },
  '.Mui-error': {
    color: '#DA2424'
  }
}));

interface ImageInputProps {
  label: string;
  id: string;
  fullWidth: boolean;
  variant: TextFieldVariants | undefined;
  value: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  InputProps: any
  //   images: string[]; // Array of image URLs
}

export const MultiImageInput: React.FC<ImageInputProps> = ({
  label,
  ...props
}) => {
  return (
    <ImageInput
      {...props}
      label={label}
      fullWidth
      required
      multiline
      rows={3} // Adjust number of rows as needed
      InputLabelProps={{ shrink: true }}
      inputProps={{
        style: {
          height: 'auto', // Ensure the input height adjusts based on content
          padding: '10px' // Adjust padding for better image display
        }
      }}
    >
      {/* Render images dynamically */}
      {/* {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Image ${index + 1}`}
          className="h-[100px] w-[100px]"
        />
      ))} */}
    </ImageInput>
  );
};
