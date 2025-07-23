import React from 'react';
import { Button, Tooltip } from 'antd';
import { DesktopOutlined, ApartmentOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Icon } from '../../atoms/Icon';

export interface QuickAction {
  /** Unique identifier */
  id: string;
  /** Action label */
  label: string;
  /** Action icon */
  icon?: React.ReactNode;
  /** Action description for tooltip */
  description?: string;
  /** Whether action is disabled */
  disabled?: boolean;
  /** Whether action is loading */
  loading?: boolean;
  /** Action type for styling */
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** Click handler */
  onClick?: () => void;
}

export interface QuickActionsProps {
  /** Array of quick actions */
  actions?: QuickAction[];
  /** Layout orientation */
  layout?: 'horizontal' | 'vertical' | 'grid';
  /** Button size */
  size?: 'small' | 'default' | 'large';
  /** Whether to show default Rescale actions */
  showDefaults?: boolean;
  /** Whether buttons should be full width in vertical layout */
  fullWidth?: boolean;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Callback for default actions */
  onNewJob?: () => void;
  onNewWorkstation?: () => void;
  onNewWorkflow?: () => void;
}

const ActionsContainer = styled.div<{ 
  $layout: string; 
  $size: string;
  $fullWidth: boolean;
}>`
  display: ${props => {
    if (props.$layout === 'grid') return 'grid';
    return 'flex';
  }};
  
  ${props => {
    if (props.$layout === 'grid') {
      return `
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: var(--rescale-space-3);
      `;
    }
    if (props.$layout === 'vertical') {
      return `
        flex-direction: column;
        gap: var(--rescale-space-2);
        ${props.$fullWidth ? 'width: 100%;' : ''}
      `;
    }
    return `
      flex-direction: row;
      gap: var(--rescale-space-3);
      align-items: center;
      flex-wrap: wrap;
    `;
  }}
`;

const ActionButton = styled(Button)<{ 
  $actionType?: string;
  $layout: string;
  $fullWidth: boolean;
}>`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-2);
  
  ${props => props.$layout === 'vertical' && props.$fullWidth && `
    width: 100%;
    justify-content: flex-start;
  `}
  
  ${props => props.$layout === 'grid' && `
    flex-direction: column;
    height: auto;
    padding: var(--rescale-space-4);
    text-align: center;
    gap: var(--rescale-space-2);
  `}
  
  .anticon {
    font-size: ${props => {
      if (props.$layout === 'grid') return '20px';
      return '16px';
    }};
  }
  
  ${props => {
    switch (props.$actionType) {
      case 'success':
        return `
          border-color: var(--rescale-color-success);
          color: var(--rescale-color-success);
          
          &:hover,
          &:focus {
            border-color: var(--rescale-color-success);
            color: var(--rescale-color-success);
            background: var(--rescale-color-success-bg);
          }
        `;
      case 'warning':
        return `
          border-color: var(--rescale-color-warning);
          color: var(--rescale-color-warning);
          
          &:hover,
          &:focus {
            border-color: var(--rescale-color-warning);
            color: var(--rescale-color-warning);
            background: var(--rescale-color-warning-bg);
          }
        `;
      case 'danger':
        return `
          border-color: var(--rescale-color-error);
          color: var(--rescale-color-error);
          
          &:hover,
          &:focus {
            border-color: var(--rescale-color-error);
            color: var(--rescale-color-error);
            background: var(--rescale-color-error-bg);
          }
        `;
      default:
        return '';
    }
  }}
`;

const ActionLabel = styled.span<{ $layout: string }>`
  font-weight: var(--rescale-font-weight-medium);
  
  ${props => props.$layout === 'grid' && `
    font-size: var(--rescale-font-size-sm);
    line-height: 1.4;
  `}
`;

const defaultActions: QuickAction[] = [
  {
    id: 'new-job',
    label: 'New Job',
    icon: <Icon name="PlayCircleOutlined" />,
    description: 'Submit a new simulation job',
    type: 'primary',
  },
  {
    id: 'new-workstation',
    label: 'New Workstation',
    icon: <DesktopOutlined />,
    description: 'Launch a new remote workstation',
    type: 'secondary',
  },
  {
    id: 'new-workflow',
    label: 'New Workflow',
    icon: <ApartmentOutlined />,
    description: 'Create a new automated workflow',
    type: 'secondary',
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions = [],
  layout = 'horizontal',
  size = 'default',
  showDefaults = true,
  fullWidth = false,
  className,
  style,
  onNewJob,
  onNewWorkstation,
  onNewWorkflow,
}) => {
  const allActions = showDefaults ? [...defaultActions, ...actions] : actions;

  const handleActionClick = (action: QuickAction) => {
    if (action.disabled || action.loading) return;
    
    // Handle default actions
    if (showDefaults) {
      switch (action.id) {
        case 'new-job':
          onNewJob?.();
          break;
        case 'new-workstation':
          onNewWorkstation?.();
          break;
        case 'new-workflow':
          onNewWorkflow?.();
          break;
      }
    }
    
    // Handle custom action
    action.onClick?.();
  };

  const getButtonType = (action: QuickAction) => {
    switch (action.type) {
      case 'primary':
        return 'primary';
      case 'danger':
        return 'primary';
      default:
        return 'default';
    }
  };

  const renderAction = (action: QuickAction) => {
    const button = (
      <ActionButton
        key={action.id}
        type={getButtonType(action)}
        size={size}
        icon={action.icon}
        loading={action.loading}
        disabled={action.disabled}
        $actionType={action.type}
        $layout={layout}
        $fullWidth={fullWidth}
        onClick={() => handleActionClick(action)}
      >
        <ActionLabel $layout={layout}>
          {action.label}
        </ActionLabel>
      </ActionButton>
    );

    if (action.description) {
      return (
        <Tooltip 
          key={action.id} 
          title={action.description} 
          placement="top"
        >
          {button}
        </Tooltip>
      );
    }

    return button;
  };

  if (allActions.length === 0) {
    return (
      <ActionsContainer
        $layout={layout}
        $size={size}
        $fullWidth={fullWidth}
        className={className}
        style={style}
      >
        <Button
          type="dashed"
          icon={<Icon name="PlusOutlined" />}
          disabled
        >
          No actions available
        </Button>
      </ActionsContainer>
    );
  }

  return (
    <ActionsContainer
      $layout={layout}
      $size={size}
      $fullWidth={fullWidth}
      className={className}
      style={style}
    >
      {allActions.map(renderAction)}
    </ActionsContainer>
  );
};

export default QuickActions;