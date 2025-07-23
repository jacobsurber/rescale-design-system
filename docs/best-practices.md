# Best Practices for Rescale Design System

This guide outlines recommended practices for using the Rescale Design System effectively, ensuring consistency, maintainability, and optimal performance.

## Component Usage

### 1. Use Semantic Components

Choose components based on their semantic meaning, not just visual appearance:

```jsx
// ✅ Good: Semantic usage
<Button type="primary">Submit Job</Button>
<Button type="default">Cancel</Button>

// ❌ Bad: Using components for wrong purpose  
<Button type="link" onClick={handleNavigation}>
  Dashboard
</Button>
// Use proper navigation components instead
```

### 2. Leverage Rescale-Specific Components

Use specialized components for Rescale-specific use cases:

```jsx
// ✅ Good: Using Rescale components for specific needs
<JobStatusIndicator 
  status="running" 
  progress={65} 
  duration="2h 15m"
  message="Processing CFD simulation..."
/>

<SoftwareLogoGrid 
  items={availableSoftware}
  maxVisible={6}
  showNames={true}
/>

// ❌ Bad: Recreating functionality with basic components
<div className="custom-status">
  <span>Running</span>
  <div className="progress-bar">
    <div style={{ width: '65%' }} />
  </div>
</div>
```

### 3. Follow Component Composition Patterns

Build complex UIs by composing simple components:

```jsx
// ✅ Good: Composing components
<Card>
  <Card.Meta 
    title={<StatusTag status="completed">Job Complete</StatusTag>}
    description="CFD simulation finished successfully"
  />
  <Divider />
  <ResourceMetrics 
    metrics={jobMetrics}
    layout="horizontal"
    size="small"
  />
  <QuickActions 
    actions={[
      { id: 'download', label: 'Download Results', icon: <DownloadOutlined /> },
      { id: 'share', label: 'Share Results', icon: <ShareAltOutlined /> }
    ]}
  />
</Card>

// ❌ Bad: Building monolithic components
<CustomJobCard 
  status="completed"
  metrics={jobMetrics}
  actions={actions}
  // Too many props, hard to maintain
/>
```

## Theming and Styling

### 1. Use CSS Variables for Custom Styling

Leverage CSS variables for consistent styling:

```css
/* ✅ Good: Using design tokens */
.custom-component {
  color: var(--rescale-color-brand-blue);
  padding: var(--rescale-space-4);
  border-radius: var(--rescale-radius-base);
  font-size: var(--rescale-font-size-base);
  box-shadow: var(--rescale-shadow-base);
}

/* ❌ Bad: Hardcoded values */
.custom-component {
  color: #0066cc;
  padding: 16px;
  border-radius: 6px;
  font-size: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### 2. Extend Theme Configuration Properly

When customizing themes, extend the base configuration:

```jsx
// ✅ Good: Extending base theme
import { rescaleTheme } from 'rescale-design-system';

const customTheme = {
  ...rescaleTheme,
  token: {
    ...rescaleTheme.token,
    colorPrimary: '#1890ff', // Override specific values
    borderRadius: 8,
  },
  components: {
    ...rescaleTheme.components,
    Button: {
      ...rescaleTheme.components?.Button,
      fontWeight: 600, // Add specific overrides
    },
  },
};

// ❌ Bad: Replacing entire theme
const customTheme = {
  token: {
    colorPrimary: '#1890ff', // Loses all Rescale defaults
  },
  components: {
    Button: {
      fontWeight: 600, // Loses all Rescale button styling
    },
  },
};
```

### 3. Use Styled Components Appropriately

Use styled-components for complex custom styling while leveraging design tokens:

```jsx
// ✅ Good: Styled component with design tokens
const StyledCard = styled(Card)`
  border: 1px solid var(--rescale-color-gray-300);
  border-radius: var(--rescale-radius-lg);
  
  &:hover {
    box-shadow: var(--rescale-shadow-lg);
    transform: translateY(-2px);
    transition: all var(--rescale-duration-base) var(--rescale-easing-ease-out);
  }
  
  .ant-card-head {
    border-bottom: 1px solid var(--rescale-color-gray-200);
    padding: var(--rescale-space-4) var(--rescale-space-6);
  }
`;

// ❌ Bad: Hardcoded values and excessive styling
const StyledCard = styled(Card)`
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  background: linear-gradient(45deg, #fff, #f9f9f9);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  /* Too much custom styling, hard to maintain */
`;
```

## Accessibility

### 1. Always Provide Meaningful Labels

Ensure all interactive elements have proper labels:

```jsx
// ✅ Good: Proper accessibility
<Button 
  icon={<DeleteOutlined />} 
  aria-label="Delete job"
  onClick={handleDelete}
/>

<Input 
  placeholder="Enter job name" 
  aria-label="Job name"
  value={jobName}
  onChange={setJobName}
/>

// ❌ Bad: Missing labels
<Button icon={<DeleteOutlined />} onClick={handleDelete} />
<Input placeholder="Enter job name" value={jobName} onChange={setJobName} />
```

### 2. Use Semantic HTML Structure

Structure content with proper semantic elements:

```jsx
// ✅ Good: Semantic structure
<main>
  <PageHeader title="Job Dashboard" />
  <section aria-labelledby="active-jobs">
    <h2 id="active-jobs">Active Jobs</h2>
    <JobsList jobs={activeJobs} />
  </section>
  <section aria-labelledby="completed-jobs">
    <h2 id="completed-jobs">Completed Jobs</h2>
    <JobsList jobs={completedJobs} />
  </section>
</main>

// ❌ Bad: Generic divs everywhere
<div>
  <div>Job Dashboard</div>
  <div>
    <div>Active Jobs</div>
    <JobsList jobs={activeJobs} />
  </div>
</div>
```

### 3. Maintain Color Contrast

Ensure sufficient color contrast for all text:

```jsx
// ✅ Good: Using semantic color variables
<Text type="secondary">Secondary information</Text>
<Text style={{ color: 'var(--rescale-color-gray-600)' }}>
  Subtle text with proper contrast
</Text>

// ❌ Bad: Poor contrast
<Text style={{ color: '#ccc' }}>Hard to read text</Text>
```

## Performance

### 1. Import Components Efficiently

Use tree-shaking friendly imports:

```jsx
// ✅ Good: Specific imports for tree-shaking
import { Button, WorkflowCard, Table } from 'rescale-design-system';

// ❌ Bad: Importing entire library
import * as RDS from 'rescale-design-system';
const { Button, WorkflowCard, Table } = RDS;
```

### 2. Optimize Theme Configuration

Avoid creating new theme objects on every render:

```jsx
// ✅ Good: Theme object outside component or memoized
const customTheme = {
  ...rescaleTheme,
  token: { ...rescaleTheme.token, colorPrimary: '#1890ff' },
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}

// ❌ Bad: Creating theme on every render
function App() {
  const theme = { // New object every render
    ...rescaleTheme,
    token: { ...rescaleTheme.token, colorPrimary: '#1890ff' },
  };
  
  return (
    <ThemeProvider theme={theme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 3. Use Appropriate Component Sizes

Choose appropriate component sizes for your use case:

```jsx
// ✅ Good: Appropriate sizing for context
<Table 
  size="small"           // For dense data tables
  dataSource={data}
  columns={columns}
/>

<Button size="large">    // For primary CTAs
  Start New Job
</Button>

<JobStatusIndicator 
  size="small"           // For compact lists
  status="running"
/>
```

## Data Handling

### 1. Use Proper TypeScript Types

Leverage the design system's TypeScript definitions:

```tsx
// ✅ Good: Using provided types
import type { 
  ResourceMetric, 
  SoftwareItem, 
  JobStatusIndicatorProps 
} from 'rescale-design-system';

interface DashboardProps {
  metrics: ResourceMetric[];
  software: SoftwareItem[];
  jobStatus: JobStatusIndicatorProps['status'];
}

// ❌ Bad: Loose typing
interface DashboardProps {
  metrics: any[];
  software: any[];
  jobStatus: string;
}
```

### 2. Handle Loading and Error States

Always handle loading and error states appropriately:

```jsx
// ✅ Good: Comprehensive state handling
function JobsList() {
  const { data: jobs, loading, error } = useJobs();
  
  if (loading) {
    return <Table loading={true} dataSource={[]} columns={columns} />;
  }
  
  if (error) {
    return (
      <Result
        status="error"
        title="Failed to load jobs"
        subTitle={error.message}
        extra={<Button onClick={refetch}>Try Again</Button>}
      />
    );
  }
  
  return <Table dataSource={jobs} columns={columns} />;
}

// ❌ Bad: No loading/error handling
function JobsList() {
  const { data: jobs } = useJobs();
  return <Table dataSource={jobs} columns={columns} />;
}
```

## Component Organization

### 1. Create Reusable Component Compositions

Build reusable compositions for common patterns:

```jsx
// ✅ Good: Reusable composition
export function JobCard({ job, onEdit, onDelete }) {
  return (
    <Card
      title={
        <Space>
          <Text strong>{job.name}</Text>
          <JobStatusIndicator status={job.status} />
        </Space>
      }
      extra={
        <QuickActions
          actions={[
            { id: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: onEdit },
            { id: 'delete', label: 'Delete', icon: <DeleteOutlined />, onClick: onDelete }
          ]}
          size="small"
        />
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text type="secondary">{job.description}</Text>
        <ResourceMetrics metrics={job.resourceUsage} layout="horizontal" size="small" />
        <SoftwareLogoGrid items={job.software} maxVisible={4} size="small" />
      </Space>
    </Card>
  );
}
```

### 2. Use Consistent File Structure

Organize components consistently:

```
src/
├── components/
│   ├── JobCard/
│   │   ├── index.ts          # Export
│   │   ├── JobCard.tsx       # Main component
│   │   ├── JobCard.test.tsx  # Tests
│   │   └── JobCard.stories.tsx # Storybook
│   └── Dashboard/
│       ├── index.ts
│       ├── Dashboard.tsx
│       ├── components/       # Internal components
│       │   ├── JobsGrid.tsx
│       │   └── MetricsPanel.tsx
│       └── hooks/           # Component-specific hooks
│           └── useJobs.ts
```

## Testing

### 1. Test Component Behavior, Not Implementation

Focus on testing user interactions and outcomes:

```jsx
// ✅ Good: Testing behavior
test('submits job when form is valid', async () => {
  const mockSubmit = jest.fn();
  render(<JobForm onSubmit={mockSubmit} />);
  
  await user.type(screen.getByLabelText('Job name'), 'Test Job');
  await user.selectOptions(screen.getByLabelText('Software'), 'ansys-fluent');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  
  expect(mockSubmit).toHaveBeenCalledWith({
    name: 'Test Job',
    software: 'ansys-fluent'
  });
});

// ❌ Bad: Testing implementation details
test('updates state when input changes', () => {
  const { getByLabelText } = render(<JobForm />);
  const input = getByLabelText('Job name');
  
  fireEvent.change(input, { target: { value: 'Test' } });
  
  expect(input.value).toBe('Test'); // Testing implementation
});
```

### 2. Use Proper Test Utilities

Use appropriate testing utilities for design system components:

```jsx
// ✅ Good: Using proper matchers and utilities
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'rescale-design-system';

function renderWithTheme(component) {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
}

test('renders job status correctly', () => {
  renderWithTheme(
    <JobStatusIndicator status="running" progress={50} />
  );
  
  expect(screen.getByText('Running')).toBeInTheDocument();
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
});
```

## Documentation

### 1. Document Custom Components

Provide clear documentation for custom components:

```jsx
/**
 * JobCard component displays job information in a card format
 * 
 * @param job - Job object containing id, name, status, etc.
 * @param onEdit - Callback function called when edit button is clicked
 * @param onDelete - Callback function called when delete button is clicked
 * @param compact - Whether to render in compact mode (default: false)
 */
export interface JobCardProps {
  job: Job;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

export function JobCard({ job, onEdit, onDelete, compact = false }: JobCardProps) {
  // Component implementation
}
```

### 2. Provide Usage Examples

Include practical usage examples:

```jsx
/**
 * @example
 * // Basic usage
 * <JobCard job={jobData} />
 * 
 * @example  
 * // With actions
 * <JobCard 
 *   job={jobData}
 *   onEdit={() => navigate(`/jobs/${job.id}/edit`)}
 *   onDelete={() => handleDelete(job.id)}
 * />
 * 
 * @example
 * // Compact mode for lists
 * <JobCard job={jobData} compact />
 */
```

## Error Handling

### 1. Implement Proper Error Boundaries

Use error boundaries to handle component errors gracefully:

```jsx
// ✅ Good: Error boundary for robust error handling
class JobErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle="There was an error loading the job data."
          extra={
            <Button onClick={() => this.setState({ hasError: false })}>
              Try Again
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

// Usage
<JobErrorBoundary>
  <JobsList />
</JobErrorBoundary>
```

### 2. Handle Component Edge Cases

Handle edge cases in component props:

```jsx
// ✅ Good: Handling edge cases
export function ResourceMetrics({ metrics = [] }) {
  if (metrics.length === 0) {
    return (
      <Empty 
        description="No metrics available"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div>
      {metrics.map(metric => (
        <MetricDisplay key={metric.type} metric={metric} />
      ))}
    </div>
  );
}

// ❌ Bad: No edge case handling
export function ResourceMetrics({ metrics }) {
  return (
    <div>
      {metrics.map(metric => ( // Will crash if metrics is undefined
        <MetricDisplay key={metric.type} metric={metric} />
      ))}
    </div>
  );
}
```

Following these best practices will help you build maintainable, accessible, and performant applications with the Rescale Design System.