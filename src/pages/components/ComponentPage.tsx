import { Box, Flex, Button, Text, Input, Password, Grid, Select, FileInput, AtomCheckbox } from '@/atoms';
import { Link } from 'react-router-dom';
import CheckboxGroup from './AtomCheckBoxGroup';
import AtomRadioGroup from './AtomRadioGroup';
import AtomRadio from '@/atoms/radio/Radio';
import { StyledPhoneInput } from './StyledPhoneInput';

const links = [
  { name: 'Primary Buttons', link: 'primary-buttons' },
  { name: 'Secondary Buttons', link: 'secondary-buttons' },
  { name: 'Text Input Fields', link: 'text-inputfields' },
  { name: 'Password Fields', link: 'password-fields' }
];

const Card: React.FC<{ title: string; children?: React.ReactNode; id: string }> = ({
  children,
  title,
  id
}: {
  title: string;
  children?: React.ReactNode;
  id: string;
}) => {
  return (
    <Box padding={'20px'} id={id}>
      <Text fontSize={'18px'} mb={'5px'}>
        {title}
      </Text>
      <hr className="mb-[20px]" />
      {children}
    </Box>
  );
};

export const ComponentPage = () => {
  return (
    <Grid width={'100vW'} height={'100vH'} gridTemplateColumns={'0.2fr 1fr'} gap="20px">
      <Box borderRight={'1px solid'} position={'sticky'}>
        <Text marginBottom={'10px'} fontWeight={'600'} p="10px">
          Components
        </Text>
        {links.map((link, index) => (
          <Link to={`/components#${link.link}`} key={index}>
            <Box p="10px" borderBottom={'1px solid grey'}>
              {link.name} →
            </Box>
          </Link>
        ))}
      </Box>
      <Box padding={'20px'}>
        <Card title="Primary Buttons" id="primary-buttons">
          <Flex gap={'20px'}>
            <Button variant="contained">Primary Button</Button>
            <Button variant="contained" disabled>
              Disabled Button
            </Button>
          </Flex>
        </Card>

        <Card title="Secondary Button" id="secondary-buttons">
          <Flex gap={'20px'}>
            <Button variant="outlined">Secondary Button</Button>
            <Button variant="outlined" disabled>
              Disabled Button
            </Button>
          </Flex>
        </Card>

        <Card title="Text Input Field" id="text-inputfields">
          <Flex gap={'20px'} flexDirection={'column'}>
            <Flex gap={'20px'}>
              {' '}
              <Input label="Simple" size="small" required fullWidth />
              <Input label="Filled Input" size="small" value="Filled" fullWidth />
            </Flex>
            <Flex gap={'20px'}>
              <Input label="Email Input" size="small" type="email" fullWidth />
              <Input label="Disabled Input" disabled size="small" value="disabled value" required fullWidth />
              <Input label="Disabled Input" disabled size="small" value="This is a disabled value" required fullWidth />
              <Input
                label="Error Input"
                size="small"
                type="text"
                required
                error
                helperText="This is a Error message"
                fullWidth
              />
              <Input
                label="Input with description"
                size="small"
                type="text"
                required
                helperText="This is a Description Message"
                fullWidth
              />
            </Flex>
            <Input
              label="Input with description and full width"
              size="small"
              type="text"
              required
              helperText="This is a Description Message"
              fullWidth
            />
          </Flex>
        </Card>

        <Card title="Input With Suffix" id="text-inputfields">
          <Flex gap={'20px'} flexDirection={'row'}>
            <Input label="Simple" size="small" suffixComponent="Kg" required fullWidth />
            <Input label="Simple" size="small" value="asdsad" suffixComponent="Kg" required fullWidth disabled />
            <Input label="Simple" size="small" value="asdsad" suffixComponent="Kg" required fullWidth error />
          </Flex>
        </Card>
        <Card title="Password" id="password-fields">
          <Flex mb={'20px'} gap={'20px'}>
            <Password required />
            <Password value="test" defaultShow required />
            <Password required error helperText="This is a error message" />
          </Flex>
          <Password fullWidth required />
        </Card>

        <Card title="Select" id="select-fields">
          <Flex mb={'20px'} gap={'20px'}>
            <Select
              fullWidth
              required
              label="Numbers"
              helperText="This is a description"
              menuOptions={[
                { label: 'One', value: 'one' },
                { label: 'Two', value: 'two' }
              ]}
            />
            <Select
              fullWidth
              required
              label="Numbers"
              error
              helperText="This is a error description"
              menuOptions={[
                { label: 'One', value: 'one' },
                { label: 'Two', value: 'two' }
              ]}
            />
            <Select
              fullWidth
              required
              label="Numbers"
              value="one"
              disabled
              helperText="This is a description"
              menuOptions={[
                { label: 'One', value: 'one' },
                { label: 'Two', value: 'two' }
              ]}
            />
            <Select
              fullWidth
              required
              label="Numbers"
              helperText="This is a description"
              menuOptions={[
                { label: 'One', value: 'one' },
                { label: 'Two', value: 'two' }
              ]}
            />
          </Flex>
        </Card>

        <Card title="File Upload" id="select-fields">
          <Flex mb={'20px'} gap={'20px'}>
            <FileInput
              label="File Upload"
              accept="image/png,image/jpeg"
              required
              fullWidth
              onChange={(e) => {
                alert(e.target.files && e.target.files[0].name);
              }}
            />
            <FileInput label="Disabled File Upload" value="image.png" disabled fullWidth />
            <FileInput label="File Upload" error helperText="This is a error message" required fullWidth />
            <FileInput label="File Upload" helperText="This is a description" required fullWidth />
          </Flex>
        </Card>
        <Card title="Check Box" id="select-fields">
          <Flex mb={'20px'} gap={'20px'}>
            <CheckboxGroup label="checkbox">
              <AtomCheckbox label="box 1" />
              <AtomCheckbox label="box 2" />
              <AtomCheckbox label="box 3" />
            </CheckboxGroup>
          </Flex>
        </Card>
        <Card title="Radio Group" id="select-fields">
          <Flex mb={'20px'} gap={'20px'} className="items-center justify-between">
            <AtomRadioGroup isRequired={true} label="label" row>
              <AtomRadio label="radio 1" value="radio1" />
              <AtomRadio label="radio 2" value="radio2" />
            </AtomRadioGroup>
            <AtomRadioGroup isRequired={false} label="label" row>
              <AtomRadio label="radio 1" value="radio1" />
              <AtomRadio label="radio 2" value="radio2" />
            </AtomRadioGroup>
            <AtomRadioGroup label="consent given" row>
              <AtomRadio label="written" value="written" />
              <AtomRadio label="audio" value="audio" />
              <AtomRadio label="video" value="video" />
            </AtomRadioGroup>
            <AtomRadioGroup label="Hepatitis" row>
              <AtomRadio label="current" value="current" />
              <AtomRadio label="healed" value="healed" />
              <AtomRadio label="history" value="history" />
            </AtomRadioGroup>
          </Flex>
        </Card>
        <Card title="Phone Input" id="select-fields">
          <Box className="w-full md:w-1/3 h-[44px]">
            <StyledPhoneInput onChange={() => {}} value="" />
          </Box>
        </Card>
      </Box>
    </Grid>
  );
};

export default ComponentPage;
