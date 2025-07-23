import React from 'react';
import { Card, Button, Steps, Alert } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, CheckOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { MainLayout } from '../../MainLayout';
import { PageHeader } from '../../../molecules/PageHeader';
import { Container } from '../../Container';
import { Stack } from '../../Spacing';
import type { PageHeaderProps } from '../../../molecules/PageHeader';
import { mediaQueries } from '../../../../styles/breakpoints';

export interface FormStep {
  key: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  status?: 'wait' | 'process' | 'finish' | 'error';
  disabled?: boolean;
}

export interface FormPageTemplateProps extends Omit<PageHeaderProps, 'children'> {
  /** Form content */
  children: React.ReactNode;
  /** Multi-step form configuration */
  steps?: FormStep[];
  /** Current step index for multi-step forms */
  currentStep?: number;
  /** Step change handler */
  onStepChange?: (step: number) => void;
  /** Back button handler */
  onBack?: () => void;
  /** Save/Submit handler */
  onSave?: () => void;
  /** Cancel handler */
  onCancel?: () => void;
  /** Next step handler */
  onNext?: () => void;
  /** Previous step handler */
  onPrevious?: () => void;
  /** Whether save button is loading */
  saveLoading?: boolean;
  /** Whether to show the back button */
  showBackButton?: boolean;
  /** Save button text */
  saveButtonText?: string;
  /** Cancel button text */
  cancelButtonText?: string;
  /** Form layout */
  layout?: 'single' | 'split' | 'wizard';
  /** Sidebar content for split layout */
  sidebar?: React.ReactNode;
  /** Form validation errors */
  errors?: string[];
  /** Success message */
  successMessage?: string;
  /** Info message */
  infoMessage?: string;
  /** Whether form is dirty (has unsaved changes) */
  isDirty?: boolean;
  /** Layout container props */
  containerProps?: {
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    padded?: boolean;
  };
}

const BackButton = styled(Button)`
  margin-bottom: var(--rescale-space-4);
  
  ${mediaQueries.mobile} {
    margin-bottom: var(--rescale-space-3);
  }
`;

const FormCard = styled(Card)`
  .ant-card-body {
    padding: var(--rescale-space-8);
    
    ${mediaQueries.mobile} {
      padding: var(--rescale-space-6);
    }
  }
`;

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--rescale-space-6);
  
  ${mediaQueries.tablet} {
    grid-template-columns: 1fr 280px;
    gap: var(--rescale-space-4);
  }
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: var(--rescale-space-4);
  }
`;

const MainContent = styled.div`
  min-width: 0;
`;

const SidebarContent = styled.div`
  ${mediaQueries.mobile} {
    order: -1;
  }
`;

const StepsContainer = styled.div`
  margin-bottom: var(--rescale-space-8);
  
  ${mediaQueries.mobile} {
    margin-bottom: var(--rescale-space-6);
  }
`;

const StepContent = styled.div`
  margin-top: var(--rescale-space-6);
`;

const FormActions = styled.div`
  display: flex;
  gap: var(--rescale-space-3);
  justify-content: flex-end;
  padding-top: var(--rescale-space-6);
  border-top: 1px solid var(--rescale-color-gray-300);
  margin-top: var(--rescale-space-6);
  
  ${mediaQueries.mobile} {
    flex-direction: column;
    gap: var(--rescale-space-2);
  }
`;

const WizardActions = styled.div`
  display: flex;
  gap: var(--rescale-space-3);
  justify-content: space-between;
  padding-top: var(--rescale-space-6);
  border-top: 1px solid var(--rescale-color-gray-300);
  margin-top: var(--rescale-space-6);
  
  ${mediaQueries.mobile} {
    flex-direction: column;
    gap: var(--rescale-space-2);
  }
`;

const MessageContainer = styled.div`
  margin-bottom: var(--rescale-space-6);
`;

export const FormPageTemplate: React.FC<FormPageTemplateProps> = ({
  children,
  steps,
  currentStep = 0,
  onStepChange,
  onBack,
  onSave,
  onCancel,
  onNext,
  onPrevious,
  saveLoading = false,
  showBackButton = true,
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel',
  layout = 'single',
  sidebar,
  errors = [],
  successMessage,
  infoMessage,
  isDirty = false,
  containerProps = { maxWidth: 'lg', padded: true },
  ...pageHeaderProps
}) => {
  const isMultiStep = steps && steps.length > 0;
  const isLastStep = isMultiStep && currentStep === steps.length - 1;
  const hasUnsavedChanges = isDirty;
  const isFirstStep = currentStep === 0;

  const renderMessages = () => (
    <MessageContainer>
      {errors.length > 0 && (
        <Alert
          type="error"
          message="Please fix the following errors:"
          description={
            <ul style={{ margin: 0, paddingLeft: '16px' }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          }
          showIcon
          style={{ marginBottom: 'var(--rescale-space-4)' }}
        />
      )}
      
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          showIcon
          style={{ marginBottom: 'var(--rescale-space-4)' }}
        />
      )}
      
      {infoMessage && (
        <Alert
          type="info"
          message={infoMessage}
          showIcon
          style={{ marginBottom: 'var(--rescale-space-4)' }}
        />
      )}
    </MessageContainer>
  );

  const renderSteps = () => {
    if (!isMultiStep || !steps) return null;

    return (
      <StepsContainer>
        <Steps
          current={currentStep}
          onChange={onStepChange}
          items={steps.map(step => ({
            title: step.title,
            description: step.description,
            status: step.status,
            disabled: step.disabled,
          }))}
        />
      </StepsContainer>
    );
  };

  const renderFormActions = () => {
    if (layout === 'wizard' && isMultiStep) {
      return (
        <WizardActions>
          <div>
            {!isFirstStep && (
              <Button onClick={onPrevious}>
                Previous
              </Button>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--rescale-space-3)' }}>
            {onCancel && (
              <Button onClick={onCancel}>
                {cancelButtonText}
              </Button>
            )}
            
            {isLastStep ? (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={onSave}
                loading={saveLoading}
              >
                Complete
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={onNext}
              >
                Next
              </Button>
            )}
          </div>
        </WizardActions>
      );
    }

    return (
      <FormActions>
        {onCancel && (
          <Button onClick={onCancel}>
            {cancelButtonText}
          </Button>
        )}
        
        {onSave && (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={onSave}
            loading={saveLoading}
          >
            {saveButtonText}
          </Button>
        )}
      </FormActions>
    );
  };

  const renderContent = () => {
    const formContent = (
      <FormCard>
        {renderMessages()}
        
        {renderSteps()}
        
        {isMultiStep && steps ? (
          <StepContent>
            {steps[currentStep]?.content}
          </StepContent>
        ) : (
          children
        )}
        
        {renderFormActions()}
      </FormCard>
    );

    if (layout === 'split' && sidebar) {
      return (
        <SplitContainer>
          <MainContent>
            {formContent}
          </MainContent>
          <SidebarContent>
            {sidebar}
          </SidebarContent>
        </SplitContainer>
      );
    }

    return formContent;
  };

  return (
    <MainLayout>
      <Container {...containerProps}>
        <Stack gap={6}>
          {showBackButton && onBack && (
            <BackButton
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              type="text"
            >
              Back
            </BackButton>
          )}
          
          <PageHeader {...pageHeaderProps} />
          
          {renderContent()}
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default FormPageTemplate;