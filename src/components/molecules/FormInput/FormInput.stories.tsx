import type { Meta, StoryObj } from '@storybook/react';
import { Form, Button, Space } from 'antd';
import { FormInput } from './FormInput';

const meta: Meta<typeof FormInput> = {
  title: 'Molecules/FormInput',
  component: FormInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Standardized input component with consistent styling, validation, and accessibility features.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'tel', 'url', 'search'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'middle', 'large'],
    },
    required: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    showCount: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormInput>;

// Wrapper component for form context
const FormWrapper = ({ children }: { children: React.ReactNode }) => (
  <Form layout="vertical" style={{ maxWidth: 400 }}>
    {children}
  </Form>
);

export const Default: Story = {
  render: (args) => (
    <FormWrapper>
      <FormInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    helperText: 'This will be used as your display name',
  },
};

export const Required: Story = {
  render: (args) => (
    <FormWrapper>
      <FormInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email',
    required: true,
    helperText: 'We\'ll never share your email with anyone else',
  },
};

export const Password: Story = {
  render: (args) => (
    <FormWrapper>
      <FormInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
    helperText: 'Must be at least 8 characters long',
  },
};

export const WithCharacterCount: Story = {
  render: (args) => (
    <FormWrapper>
      <FormInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'description',
    label: 'Project Description',
    placeholder: 'Describe your project',
    maxLength: 100,
    showCount: true,
    helperText: 'Brief description of what your project does',
  },
};

export const ErrorState: Story = {
  render: (args) => (
    <FormWrapper>
      <FormInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'email_error',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
};

export const SuccessState: Story = {
  render: (args) => (
    <FormWrapper>
      <FormInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'username_success',
    label: 'Username',
    placeholder: 'Enter your username',
    value: 'john_doe',
    successMessage: 'Username is available!',
  },
};

export const Disabled: Story = {
  render: (args) => (
    <FormWrapper>
      <FormInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'readonly_field',
    label: 'Read Only Field',
    value: 'This field cannot be edited',
    disabled: true,
    helperText: 'This field is automatically generated',
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <FormWrapper>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <FormInput
          name="small_input"
          label="Small Input"
          size="small"
          placeholder="Small size input"
        />
        <FormInput
          name="medium_input"
          label="Medium Input (Default)"
          size="middle"
          placeholder="Medium size input"
        />
        <FormInput
          name="large_input"
          label="Large Input"
          size="large"
          placeholder="Large size input"
        />
      </Space>
    </FormWrapper>
  ),
};

export const InputTypes: Story = {
  render: () => (
    <FormWrapper>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <FormInput
          name="text_input"
          label="Text Input"
          type="text"
          placeholder="Enter text"
        />
        <FormInput
          name="email_input"
          label="Email Input"
          type="email"
          placeholder="Enter email address"
        />
        <FormInput
          name="password_input"
          label="Password Input"
          type="password"
          placeholder="Enter password"
        />
        <FormInput
          name="tel_input"
          label="Phone Input"
          type="tel"
          placeholder="Enter phone number"
        />
        <FormInput
          name="url_input"
          label="URL Input"
          type="url"
          placeholder="Enter website URL"
        />
        <FormInput
          name="search_input"
          label="Search Input"
          type="search"
          placeholder="Search..."
        />
      </Space>
    </FormWrapper>
  ),
};

export const CompleteForm: Story = {
  render: () => {
    const onFinish = (values: any) => {
      console.log('Form values:', values);
    };

    return (
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 400 }}>
        <FormInput
          name="firstName"
          label="First Name"
          placeholder="Enter your first name"
          required
        />
        <FormInput
          name="lastName"
          label="Last Name"
          placeholder="Enter your last name"
          required
        />
        <FormInput
          name="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          required
          helperText="We'll use this to contact you about your account"
        />
        <FormInput
          name="password"
          label="Password"
          type="password"
          placeholder="Create a password"
          required
          helperText="Must be at least 8 characters with letters and numbers"
        />
        <FormInput
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself"
          maxLength={200}
          showCount
          helperText="Optional - this will appear on your profile"
        />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Account
          </Button>
        </Form.Item>
      </Form>
    );
  },
};