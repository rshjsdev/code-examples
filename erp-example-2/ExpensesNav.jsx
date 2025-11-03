import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';

import useLanguage from '@/locale/useLanguage';
import logoIcon from '@/style/images/logo-icon.svg';
import logoText from '@/style/images/logo-text.svg';
import { useNavigate } from 'react-router-dom';
import useResponsive from '@/hooks/useResponsive';

import {
  SettingOutlined,
  MenuOutlined,
  WalletOutlined,
} from '@ant-design/icons';

const { Slider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  let location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));

  const translate = useLanguage();
  const navigate = useNavigate();

  const items = [
    {
      key: 'expenses',
      icon: <WalletOutlined />,
      label: <Link to={'/expenses'}>{translate('expense')}</Link>,
    },
    {
      key: 'expensesCategory',
      icon: <SettingOutlined />,
      label: <Link to={'/category/expenses'}>{translate('expenses_Category')}</Link>,
    },
  ];

  useEffect(() => {
    if (location && currentPath !== location.pathname) {
      setCurrentPath('dashboard');
    }
  }, [location, currentPath]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isNavMenuClose) setLogoApp(isNavMenuClose)
    }, 200);

    return () => clearTimeout(timer);
  }, [isNavMenuClose]);

  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      theme={'light'}
    >
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logoIcon} alt="Logo" />

        {!showLogoApp && (
          <img
            src={logoText}
            alt="Logo"
          />
        )}
      </div>
      <Menu
        items={items}
        mode="inline"
        theme={'light'}
        selectedKeys={[currentPath]}
      />
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={() => setVisible(true)}
        className="mobile-sidebar-btn"
      >
        <MenuOutlined />
      </Button>
      <Drawer
        width={250}
        contentWrapperStyle={{ boxShadow: 'none' }}
        placement="left"
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
      >
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}
