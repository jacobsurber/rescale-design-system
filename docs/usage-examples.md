# Usage Examples and Best Practices

This guide provides comprehensive examples and best practices for using the Rescale Design System effectively in your applications.

## Table of Contents

- [Getting Started](#getting-started)
- [Component Patterns](#component-patterns)
- [Form Handling](#form-handling)
- [Data Display](#data-display)
- [Layout Patterns](#layout-patterns)
- [Animation Guidelines](#animation-guidelines)
- [Performance Best Practices](#performance-best-practices)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Common Patterns](#common-patterns)

## Getting Started

### Theme Configuration

Set up your theme provider at the root of your application:

```tsx
// App.tsx
import React from 'react';
import { RescaleThemeProvider, createTheme } from 'rescale-design-system';
import 'rescale-design-system/dist/index.css';

// Custom theme configuration
const customTheme = createTheme({
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  }
});

function App() {
  return (
    <RescaleThemeProvider theme={customTheme}>
      <YourApplication />
    </RescaleThemeProvider>
  );
}
```

### Component Import Patterns

Use named imports for better tree shaking:

```tsx
// ✅ Good - Named imports
import { Button, Icon, Input } from 'rescale-design-system';

// ❌ Avoid - Default imports
import RescaleDesignSystem from 'rescale-design-system';
const { Button } = RescaleDesignSystem;
```

## Component Patterns

### Button Usage Patterns

#### Action Buttons

```tsx
import { Button, Icon } from 'rescale-design-system';

// Primary actions
<Button variant="primary" size="md">
  Create Job
</Button>

// Secondary actions
<Button variant="secondary" size="md">
  Cancel
</Button>

// Destructive actions
<Button variant="danger" size="md">
  Delete Job
</Button>

// Icon buttons
<Button 
  iconOnly 
  icon={<Icon name="EditOutlined" />}
  aria-label="Edit job"
  size="sm"
/>
```

#### Loading States

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await submitJob();
  } finally {
    setIsLoading(false);
  }
};

<Button 
  variant="primary"
  loading={isLoading}
  loadingText="Creating job..."
  onClick={handleSubmit}
>
  Create Job
</Button>
```

#### Button Groups

```tsx
import { ButtonGroup, Button } from 'rescale-design-system';

<ButtonGroup>
  <Button variant="secondary">Previous</Button>
  <Button variant="primary">Next</Button>
</ButtonGroup>

// Toggle buttons
<ButtonGroup toggle>
  <Button>Grid View</Button>
  <Button>List View</Button>
</ButtonGroup>
```

### Icon Usage Patterns

```tsx
import { Icon } from 'rescale-design-system';

// Status indicators
<Icon name="CheckCircleOutlined" color="success" size="md" />
<Icon name="CloseCircleOutlined" color="error" size="md" />
<Icon name="ExclamationCircleOutlined" color="warning" size="md" />

// Interactive icons
<Icon 
  name="DeleteOutlined"
  clickable
  color="error"
  onClick={() => handleDelete()}
  aria-label="Delete item"
/>

// Loading states
<Icon name="LoadingOutlined" spin color="primary" />
```

## Form Handling

### Basic Form

```tsx
import { Form, FormInput, Button, Select } from 'rescale-design-system';
import { useForm } from 'react-hook-form';

interface JobFormData {
  name: string;
  software: string;
  cores: number;
}

function JobForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }
  } = useForm<JobFormData>();

  const onSubmit = async (data: JobFormData) => {
    await createJob(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        label="Job Name"
        {...register('name', { required: 'Job name is required' })}
        error={errors.name?.message}
        placeholder="Enter job name"
      />

      <Select
        label="Software"
        {...register('software', { required: 'Software selection is required' })}
        options={softwareOptions}
        placeholder="Select software"
        error={errors.software?.message}
      />

      <FormInput
        label="CPU Cores"
        type="number"
        {...register('cores', { 
          required: 'Core count is required',
          min: { value: 1, message: 'Minimum 1 core required' }
        })}
        error={errors.cores?.message}
      />

      <Button 
        type="submit" 
        variant="primary" 
        loading={isSubmitting}
        block
      >
        Create Job
      </Button>
    </Form>
  );
}
```

### Advanced Form with Validation

```tsx
import { DateRangePicker, FileUpload, Checkbox } from 'rescale-design-system';

function AdvancedJobForm() {
  const [formData, setFormData] = useState({
    name: '',
    dateRange: null,
    files: [],
    notifications: true
  });

  return (
    <Form layout="vertical">
      <FormInput
        label="Job Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        rules={[
          { required: true, message: 'Job name is required' },
          { min: 3, message: 'Name must be at least 3 characters' }
        ]}
      />

      <DateRangePicker
        label="Schedule"
        value={formData.dateRange}
        onChange={(range) => setFormData({ ...formData, dateRange: range })}
        showTime
      />

      <FileUpload
        label="Input Files"
        multiple
        accept=".inp,.dat,.mesh"
        onChange={(files) => setFormData({ ...formData, files })}
        maxSize={100 * 1024 * 1024} // 100MB
      />

      <Checkbox
        checked={formData.notifications}
        onChange={(checked) => setFormData({ ...formData, notifications: checked })}
      >
        Send notifications when job completes
      </Checkbox>
    </Form>
  );
}
```

## Data Display

### Jobs Table

```tsx
import { JobsTable, StatusTag, Button } from 'rescale-design-system';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <StatusTag status={status} />
  },
  {
    title: 'Progress',
    dataIndex: 'progress',
    key: 'progress',
    render: (progress: number) => (
      <Progress percent={progress} size="small" />
    )
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Button.Group size="small">
        <Button icon={<Icon name="PlayCircleOutlined" />}>
          Start
        </Button>
        <Button icon={<Icon name="PauseCircleOutlined" />}>
          Pause
        </Button>
        <Button 
          danger 
          icon={<Icon name="DeleteOutlined" />}
          onClick={() => handleDelete(record.id)}
        >
          Delete
        </Button>
      </Button.Group>
    )
  }
];

function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  return (
    <JobsTable
      columns={columns}
      dataSource={jobs}
      loading={loading}
      pagination={pagination}
      onChange={(page, filters, sorter) => {
        setPagination(page);
        // Handle filtering and sorting
      }}
      rowSelection={{
        onChange: (selectedRowKeys) => {
          console.log('Selected:', selectedRowKeys);
        }
      }}
    />
  );
}
```

### Performance Dashboard

```tsx
import { 
  PerformanceDashboard, 
  ResourceMetrics,
  Chart,
  Grid 
} from 'rescale-design-system';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);

  return (
    <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap={4}>
      <ResourceMetrics
        title="CPU Usage"
        value={85}
        unit="%"
        trend="up"
        color="warning"
      />
      
      <ResourceMetrics
        title="Memory Usage"
        value={12.5}
        unit="GB"
        trend="stable"
        color="info"
      />
      
      <ResourceMetrics
        title="Storage"
        value={245}
        unit="GB"
        trend="down"
        color="success"
      />

      <Chart
        type="line"
        data={performanceData}
        title="Performance Over Time"
        height={300}
        gridColumn="1 / -1"
      />
    </Grid>
  );
}
```

## Layout Patterns

### Page Layouts

```tsx
import { Layout, Sidebar, TopBar, Breadcrumb } from 'rescale-design-system';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <TopBar
        title="Rescale"
        user={{
          name: "John Doe",
          avatar: "/avatar.jpg"
        }}
        notifications={notifications}
      />
      
      <Layout.Content>
        <Sidebar
          items={sidebarItems}
          collapsed={false}
          onCollapse={setCollapsed}
        />
        
        <Layout.Main>
          <Breadcrumb
            items={[
              { title: 'Home', href: '/' },
              { title: 'Jobs', href: '/jobs' },
              { title: 'Job Details' }
            ]}
          />
          
          <div className="page-content">
            {children}
          </div>
        </Layout.Main>
      </Layout.Content>
    </Layout>
  );
}
```

### Responsive Grid

```tsx
import { Grid, Card } from 'rescale-design-system';

function ResponsiveGrid() {
  return (
    <Grid 
      columns={{
        xs: 1,      // 1 column on mobile
        sm: 2,      // 2 columns on tablet
        md: 3,      // 3 columns on desktop
        lg: 4,      // 4 columns on large screens
        xl: 6       // 6 columns on extra large
      }}
      gap={{ xs: 2, md: 4 }}
      align="stretch"
    >
      {items.map(item => (
        <Card key={item.id}>
          <Card.Title>{item.title}</Card.Title>
          <Card.Content>{item.content}</Card.Content>
        </Card>
      ))}
    </Grid>
  );
}
```

## Animation Guidelines

### Page Transitions

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function AnimatedPages() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          {/* Your routes */}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
```

### Loading States

```tsx
import { Skeleton, LoadingSpinner } from 'rescale-design-system';

function LoadingPatterns() {
  return (
    <>
      {/* Skeleton for content loading */}
      <Skeleton>
        <Skeleton.Input style={{ width: 200 }} />
        <Skeleton.Text lines={3} />
        <Skeleton.Button />
      </Skeleton>

      {/* Spinner for actions */}
      <LoadingSpinner size="large" text="Processing job..." />
    </>
  );
}
```

## Performance Best Practices

### Lazy Loading Components

```tsx
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from 'rescale-design-system';

// Lazy load heavy components
const JobsTable = lazy(() => import('./JobsTable'));
const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/jobs" element={<JobsTable />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

### Optimizing Large Lists

```tsx
import { VirtualTable } from 'rescale-design-system';

function LargeJobsList({ jobs }: { jobs: Job[] }) {
  return (
    <VirtualTable
      items={jobs}
      itemHeight={60}
      containerHeight={400}
      renderItem={({ item, index, style }) => (
        <div style={style} className="job-row">
          <JobCard job={item} />
        </div>
      )}
      overscan={5}
    />
  );
}
```

### Memoization

```tsx
import { memo, useMemo, useCallback } from 'react';

const JobCard = memo(function JobCard({ job, onEdit, onDelete }) {
  const statusColor = useMemo(() => {
    return getStatusColor(job.status);
  }, [job.status]);

  const handleEdit = useCallback(() => {
    onEdit(job.id);
  }, [onEdit, job.id]);

  return (
    <Card>
      <StatusTag color={statusColor}>{job.status}</StatusTag>
      <Button onClick={handleEdit}>Edit</Button>
    </Card>
  );
});
```

## Accessibility Guidelines

### Keyboard Navigation

```tsx
import { useKeyboardNavigation } from 'rescale-design-system/hooks';

function AccessibleTable() {
  const { activeIndex, setActiveIndex } = useKeyboardNavigation({
    total: items.length,
    onSelect: (index) => handleSelect(items[index])
  });

  return (
    <div
      role="grid"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          role="gridcell"
          className={activeIndex === index ? 'active' : ''}
          aria-selected={activeIndex === index}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

### Screen Reader Support

```tsx
import { VisuallyHidden, announce } from 'rescale-design-system/a11y';

function AccessibleForm() {
  const handleSubmit = async () => {
    try {
      await submitForm();
      announce('Form submitted successfully', 'polite');
    } catch (error) {
      announce('Form submission failed', 'assertive');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VisuallyHidden>
        <h2>Job Creation Form</h2>
      </VisuallyHidden>
      
      <FormInput
        label="Job Name"
        aria-describedby="job-name-help"
        required
      />
      <div id="job-name-help" className="help-text">
        Enter a descriptive name for your job
      </div>
    </form>
  );
}
```

## Common Patterns

### Error Handling

```tsx
import { ErrorBoundary, Alert } from 'rescale-design-system';

function ErrorHandling() {
  const [error, setError] = useState(null);

  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <Alert
          type="error"
          title="Something went wrong"
          message={error.message}
          action={
            <Button onClick={retry}>
              Try Again
            </Button>
          }
        />
      )}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### Search and Filtering

```tsx
import { SearchInput, Filter, Dropdown } from 'rescale-design-system';

function SearchAndFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  return (
    <div className="search-controls">
      <SearchInput
        placeholder="Search jobs..."
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={() => setSearchTerm('')}
      />

      <Filter
        title="Status"
        options={statusOptions}
        value={filters.status}
        onChange={(status) => setFilters({ ...filters, status })}
      />

      <Dropdown
        title="More Filters"
        items={[
          { key: 'date', label: 'Date Range' },
          { key: 'software', label: 'Software' },
          { key: 'cores', label: 'Core Count' }
        ]}
      />
    </div>
  );
}
```

### Real-time Updates

```tsx
import { useWebSocket, Badge } from 'rescale-design-system';

function RealTimeJobStatus() {
  const { data: jobUpdates, isConnected } = useWebSocket('/api/jobs/stream');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (jobUpdates) {
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobUpdates.id 
            ? { ...job, ...jobUpdates }
            : job
        )
      );
    }
  }, [jobUpdates]);

  return (
    <div>
      <div className="status-indicator">
        <Badge 
          status={isConnected ? 'success' : 'error'}
          text={isConnected ? 'Live' : 'Disconnected'}
        />
      </div>
      
      <JobsList jobs={jobs} />
    </div>
  );
}
```

### Modal Patterns

```tsx
import { Modal, useModal } from 'rescale-design-system';

function ModalPatterns() {
  const confirmModal = useModal();
  const formModal = useModal();

  const handleDelete = () => {
    confirmModal.open({
      title: 'Delete Job',
      content: 'Are you sure you want to delete this job?',
      onConfirm: () => {
        deleteJob();
        confirmModal.close();
      }
    });
  };

  return (
    <>
      <Button onClick={handleDelete}>Delete</Button>
      <Button onClick={() => formModal.open()}>Edit</Button>

      <Modal
        {...confirmModal.props}
        type="confirm"
        confirmText="Delete"
        cancelText="Cancel"
      />

      <Modal
        {...formModal.props}
        title="Edit Job"
        width={600}
      >
        <JobEditForm onSave={() => formModal.close()} />
      </Modal>
    </>
  );
}
```

## Testing Patterns

### Component Testing

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RescaleThemeProvider } from 'rescale-design-system';
import { JobsTable } from './JobsTable';

function renderWithTheme(component: React.ReactElement) {
  return render(
    <RescaleThemeProvider>
      {component}
    </RescaleThemeProvider>
  );
}

test('displays jobs in table', async () => {
  const mockJobs = [
    { id: '1', name: 'Test Job', status: 'running' }
  ];

  renderWithTheme(
    <JobsTable jobs={mockJobs} loading={false} />
  );

  expect(screen.getByText('Test Job')).toBeInTheDocument();
  expect(screen.getByText('running')).toBeInTheDocument();
});

test('handles job selection', async () => {
  const onSelect = jest.fn();
  
  renderWithTheme(
    <JobsTable 
      jobs={mockJobs} 
      onSelect={onSelect}
      selectable 
    />
  );

  fireEvent.click(screen.getByRole('checkbox'));
  expect(onSelect).toHaveBeenCalledWith(['1']);
});
```

These patterns provide a solid foundation for building robust, accessible, and performant applications with the Rescale Design System.