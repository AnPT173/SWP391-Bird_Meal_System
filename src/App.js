import { useEffect } from 'react';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// hooks
import useAuth from './hooks/useAuth';

// components
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import GoogleAnalytics from './components/GoogleAnalytics';
import NotistackProvider from './components/NotistackProvider';
import ThemePrimaryColor from './components/ThemePrimaryColor';
import ThemeLocalization from './components/ThemeLocalization';
import { createDatabase } from './utils/indexedDb';
import {
  saveBirdData,
  saveCageData,
  saveFoodType,
  saveLocationData,
  saveSchedule
} from './utils/mock-data/localStorageUtil';
import { cagesData } from './utils/mock-data/cage';
import { birdsData } from './utils/mock-data/bird';
import { scheduleData } from './utils/mock-data/schedule';
import { foodsData } from './utils/mock-data/food';

// ----------------------------------------------------------------------

export default function App() {
  const { isInitialized } = useAuth();

  useEffect(async () => {
    const location = await localStorage.getItem('locationData');
    const cage = await localStorage.getItem('cagesData');
    const bird = await localStorage.getItem('birdData');
    const schedule = await localStorage.getItem('foodType');
    const foodType = await localStorage.getItem('schedule');

    // location ?? saveLocationData
    if (!cage) saveCageData(cagesData);
    if (!bird) saveBirdData(birdsData);
    if (!schedule) saveSchedule(scheduleData);
    if (!foodType) saveFoodType(foodsData);
  }, []);
  
  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <ThemeLocalization>
          <RtlLayout>
            <NotistackProvider>
              <Settings />
              <ScrollToTop />
              <GoogleAnalytics />
              <Router />
            </NotistackProvider>
          </RtlLayout>
        </ThemeLocalization>
      </ThemePrimaryColor>
    </ThemeConfig>
  );
}
