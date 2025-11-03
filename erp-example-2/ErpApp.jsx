import { useLayoutEffect } from 'react';
import { useEffect } from 'react';
import { selectAppSettings } from '@/redux/settings/selectors';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from 'antd';

import { useAppContext } from '@/context/appContext';

import Navigation from '@/apps/Navigation/NavigationContainer';
import ExpensesNav from '@/apps/Navigation/ExpensesNav';
import HeaderContent from '@/apps/Header/HeaderContainer';
import PageLoader from '@/components/PageLoader';

import { settingsAction } from '@/redux/settings/actions';
import { currencyAction } from '@/redux/currency/actions';
import { translateAction } from '@/redux/translate/actions';
import { selectSettings } from '@/redux/settings/selectors';

import AppRouter from '@/router/AppRouter';

import useResponsive from '@/hooks/useResponsive';

import storePersist from '@/redux/storePersist';
import { selectLangDirection } from '@/redux/translate/selectors';

export default function ErpCrmApp() {
  const { Content } = Layout;

  const { state: stateApp, appContextAction } = useAppContext();
  const { app } = appContextAction;
  const { isNavMenuClose, currentApp } = stateApp;

  const { isMobile } = useResponsive();

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
    dispatch(currencyAction.list());
  }, []);

  const appSettings = useSelector(selectAppSettings);

  const { isSuccess: settingIsloaded } = useSelector(selectSettings);

  useEffect(() => {
    const { loadDefaultLang } = storePersist.get('firstVisit');
    if (appSettings.idurar_app_language && !loadDefaultLang) {
      dispatch(translateAction.translate(appSettings.idurar_app_language));
      window.localStorage.setItem('firstVisit', JSON.stringify({ loadDefaultLang: true }));
    }
  }, [appSettings]);
  const langDirection = useSelector(selectLangDirection);

  if (settingIsloaded)
    return (
      <Layout hasSider>
        {currentApp === 'default' ? <Navigation /> : <ExpensesNav />}
        <Navigation />

        {isMobile ? (
          <MobileLayout>
            <HeaderContent />
            <Content>
              <AppRouter />
            </Content>
          </MobileLayout>
        ) : (
          <Layout>
            <HeaderContentWrapper />
            <Content>
              <AppRouter />
            </Content>
          </Layout>
        )}
      </Layout>
    );
  else return <PageLoader />;
}
