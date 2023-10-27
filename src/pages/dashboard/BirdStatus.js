import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
// material
import { Container, Tab, Box, Tabs, Stack, Grid, Skeleton } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUsers } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import CageCard from '../../components/_dashboard/user/cards/CageCard';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import StatusForm from '../../components/_dashboard/user/StatusForm';


// ----------------------------------------------------------------------

const SkeletonLoad = (
  <>
    {[...Array(8)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);

const STATUS_TABS = [
  {
    value: 'Normal',
    component: <StatusForm />
  },
  {
    value: 'Sick',
    component: <StatusForm />
  },
  {
    value: 'Birth',
    component: <StatusForm />
  },
];

export default function BirdStatus() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('Normal');
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      dispatch(getUsers());
    }, 20);
  }, [dispatch]);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const {speciesId, periodId} = useParams();

  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  return (
    <Page title="Food Plan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Food Plan"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Species', href: PATH_DASHBOARD.food.species },
          { name: 'Period', href: PATH_DASHBOARD.food.period },
          { name: 'Food Plan' }]}
        />
        <Stack spacing={5}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeTab}
          >
            {STATUS_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={tab.value} value={tab.value} />
            ))}
          </Tabs>

          {STATUS_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Stack>
      </Container>
    </Page>
  );
}
