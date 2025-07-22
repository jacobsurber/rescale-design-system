import type { Meta, StoryObj } from '@storybook/react';
import { VirtualTable } from './VirtualTable';
import type { ColumnsType } from 'antd/es/table';

// Generate mock data
const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    age: Math.floor(Math.random() * 50) + 20,
    department: ['Engineering', 'Design', 'Product', 'Marketing'][Math.floor(Math.random() * 4)],
    status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    salary: Math.floor(Math.random() * 100000) + 50000,
  }));
};

const columns: ColumnsType<any> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 60,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 120,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 200,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 60,
  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    width: 120,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status: string) => (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        color: status === 'Active' ? '#52c41a' : status === 'Inactive' ? '#ff4d4f' : '#fa8c16',
        backgroundColor: status === 'Active' ? '#f6ffed' : status === 'Inactive' ? '#fff2f0' : '#fff7e6',
      }}>
        {status}
      </span>
    ),
  },
  {
    title: 'Join Date',
    dataIndex: 'joinDate',
    key: 'joinDate',
    width: 120,
  },
  {
    title: 'Salary',
    dataIndex: 'salary',
    key: 'salary',
    width: 100,
    render: (salary: number) => `$${salary.toLocaleString()}`,
  },
];

const meta: Meta<typeof VirtualTable> = {
  title: 'Molecules/VirtualTable',
  component: VirtualTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A high-performance virtual scrolling table for handling large datasets efficiently.',
      },
    },
  },
  argTypes: {
    height: {
      control: { type: 'number', min: 200, max: 800 },
      description: 'Height of the virtual table container',
    },
    estimateRowHeight: {
      control: { type: 'number', min: 30, max: 100 },
      description: 'Estimated height of each row',
    },
    overscan: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Buffer size for virtual scrolling',
    },
    infiniteScroll: {
      control: { type: 'boolean' },
      description: 'Enable infinite scrolling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof VirtualTable>;

export const SmallDataset: Story = {
  args: {
    height: 400,
    dataSource: generateMockData(100),
    columns,
    estimateRowHeight: 50,
  },
  parameters: {
    docs: {
      description: {
        story: 'Virtual table with 100 rows to demonstrate basic functionality.',
      },
    },
  },
};

export const LargeDataset: Story = {
  args: {
    height: 600,
    dataSource: generateMockData(10000),
    columns,
    estimateRowHeight: 50,
    overscan: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Virtual table with 10,000 rows demonstrating performance with large datasets.',
      },
    },
  },
};

export const CompactRows: Story = {
  args: {
    height: 400,
    dataSource: generateMockData(1000),
    columns,
    estimateRowHeight: 35,
  },
  parameters: {
    docs: {
      description: {
        story: 'Virtual table with smaller row height for compact display.',
      },
    },
  },
};

export const WithInfiniteScroll: Story = {
  args: {
    height: 500,
    dataSource: generateMockData(500),
    columns,
    estimateRowHeight: 50,
    infiniteScroll: true,
    loading: false,
  },
  render: (args) => {
    const [data, setData] = React.useState(args.dataSource);
    const [loading, setLoading] = React.useState(false);

    const handleLoadMore = React.useCallback(() => {
      if (loading) return;
      
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const newData = generateMockData(100);
        const startId = data.length + 1;
        const updatedData = newData.map((item, index) => ({
          ...item,
          id: startId + index,
          name: `User ${startId + index}`,
          email: `user${startId + index}@example.com`,
        }));
        
        setData(prev => [...prev, ...updatedData]);
        setLoading(false);
      }, 1000);
    }, [data.length, loading]);

    return (
      <VirtualTable
        {...args}
        dataSource={data}
        loading={loading}
        onLoadMore={handleLoadMore}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Virtual table with infinite scroll - scroll to bottom to load more data.',
      },
    },
  },
};

export const CustomRowHeight: Story = {
  args: {
    height: 400,
    dataSource: generateMockData(500),
    columns: [
      ...columns,
      {
        title: 'Description',
        key: 'description',
        width: 200,
        render: () => (
          <div style={{ padding: '8px 0' }}>
            <div>This is a longer description</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              With multiple lines of content
            </div>
          </div>
        ),
      },
    ],
    estimateRowHeight: 70,
  },
  parameters: {
    docs: {
      description: {
        story: 'Virtual table with taller rows containing multi-line content.',
      },
    },
  },
};

export const PerformanceComparison: Story = {
  render: () => {
    const [showVirtual, setShowVirtual] = React.useState(true);
    const data = generateMockData(5000);

    return (
      <div>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
          <button
            onClick={() => setShowVirtual(!showVirtual)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Switch to {showVirtual ? 'Regular' : 'Virtual'} Table
          </button>
          <span style={{ fontSize: '14px', color: '#666' }}>
            Currently showing: <strong>{showVirtual ? 'Virtual Table' : 'Regular Table'}</strong> with 5,000 rows
          </span>
        </div>
        
        {showVirtual ? (
          <VirtualTable
            height={500}
            dataSource={data}
            columns={columns}
            estimateRowHeight={50}
          />
        ) : (
          <div style={{ 
            height: 500, 
            overflow: 'auto',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#fafafa' }}>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} style={{ 
                      padding: '12px 16px',
                      textAlign: 'left',
                      borderBottom: '1px solid #d9d9d9',
                    }}>
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px' }}>{row.id}</td>
                    <td style={{ padding: '12px 16px' }}>{row.name}</td>
                    <td style={{ padding: '12px 16px' }}>{row.email}</td>
                    <td style={{ padding: '12px 16px' }}>{row.age}</td>
                    <td style={{ padding: '12px 16px' }}>{row.department}</td>
                    <td style={{ padding: '12px 16px' }}>{row.status}</td>
                    <td style={{ padding: '12px 16px' }}>{row.joinDate}</td>
                    <td style={{ padding: '12px 16px' }}>${row.salary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance comparison between virtual table and regular table rendering. Toggle between them to see the difference in scroll performance.',
      },
    },
  },
};

// React import for hooks
import React from 'react';