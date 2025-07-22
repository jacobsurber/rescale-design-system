import React, { useState, useEffect } from 'react';
import { Layout, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Sidebar } from '../../navigation/Sidebar';
import { TopBar } from '../../navigation/TopBar';
import { mediaQueries } from '../../../styles/breakpoints';

const { Content } = Layout;

export interface MainLayoutProps {
  /** Content to render in the main area */
  children: React.ReactNode;
  /** Whether the sidebar is initially collapsed */
  defaultCollapsed?: boolean;
  /** Custom sidebar content */
  sidebarContent?: React.ReactNode;
  /** Custom top bar content */
  topBarContent?: React.ReactNode;
  /** Whether to show the mobile menu button */
  showMobileMenu?: boolean;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const LayoutContainer = styled(Layout)`
  min-height: 100vh;
  background: var(--rescale-color-white);
`;

const StyledSider = styled(Layout.Sider)<{ $collapsed: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background: var(--rescale-color-white);
  border-right: 1px solid var(--rescale-color-gray-300);
  
  ${mediaQueries.mobile} {
    display: none;
  }
  
  .ant-layout-sider-children {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .ant-layout-sider-trigger {
    display: none;
  }
`;

const MainContainer = styled(Layout)<{ $sidebarCollapsed: boolean }>`
  margin-left: ${props => props.$sidebarCollapsed ? '80px' : '240px'};
  transition: margin-left var(--rescale-duration-normal) var(--rescale-easing-ease-in-out);
  
  ${mediaQueries.mobile} {
    margin-left: 0;
  }
`;

const StyledHeader = styled(Layout.Header)`
  position: sticky;
  top: 0;
  z-index: 999;
  height: 56px;
  line-height: 56px;
  padding: 0;
  background: var(--rescale-color-white);
  border-bottom: 1px solid var(--rescale-color-gray-300);
  box-shadow: var(--rescale-shadow-sm);
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1001;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--rescale-color-white);
  border-radius: var(--rescale-radius-base);
  box-shadow: var(--rescale-shadow-md);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all var(--rescale-duration-fast) var(--rescale-easing-ease-in-out);
  
  ${mediaQueries.mobile} {
    display: flex;
  }
  
  &:hover {
    background: var(--rescale-color-gray-100);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  .anticon {
    color: var(--rescale-color-gray-700);
    font-size: 16px;
  }
`;

const StyledContent = styled(Content)`
  padding: var(--rescale-space-6);
  background: var(--rescale-color-gray-50);
  min-height: calc(100vh - 56px);
  
  ${mediaQueries.mobile} {
    padding: var(--rescale-space-4);
  }
`;

const MobileSidebar = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
    background: var(--rescale-color-white);
  }
  
  .ant-drawer-header {
    border-bottom: 1px solid var(--rescale-color-gray-300);
    padding: var(--rescale-space-4);
  }
`;

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  defaultCollapsed = false,
  sidebarContent,
  topBarContent,
  showMobileMenu = true,
  className,
  style,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  const sidebarProps = {
    items: [], // Default empty items
    collapsed: collapsed && !isMobile,
    onCollapse: handleSidebarToggle,
  };

  return (
    <LayoutContainer className={className} style={style}>
      {/* Desktop Sidebar */}
      <StyledSider
        width={240}
        collapsedWidth={80}
        collapsed={collapsed}
        collapsible={false}
        $collapsed={collapsed}
      >
        {sidebarContent || <Sidebar {...sidebarProps} />}
      </StyledSider>

      {/* Mobile Menu Button */}
      {showMobileMenu && isMobile && (
        <MobileMenuButton onClick={() => setMobileDrawerOpen(true)}>
          <MenuOutlined />
        </MobileMenuButton>
      )}

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar
        title="Navigation"
        placement="left"
        width={280}
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerClose}
        bodyStyle={{ padding: 0 }}
      >
        {sidebarContent || <Sidebar items={[]} collapsed={false} />}
      </MobileSidebar>

      {/* Main Content Area */}
      <MainContainer $sidebarCollapsed={collapsed}>
        <StyledHeader>
          {topBarContent || <TopBar />}
        </StyledHeader>
        
        <StyledContent>
          {children}
        </StyledContent>
      </MainContainer>
    </LayoutContainer>
  );
};

export default MainLayout;