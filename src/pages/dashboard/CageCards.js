import { useEffect, useState } from 'react';
// material
import { Container, Grid, Skeleton, Stack, Tab, Tabs, Box } from '@material-ui/core';
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

const LOCATION_TABS = [
  {
    value: 'Normal',
    component: <CageCard status="Normal" />
  },
  {
    value: 'Sick',
    component: <CageCard status="Sick" />
  },
  {
    value: 'Birth',
    component: <CageCard status="Birth" />
  }
];

export default function CageCards() {
  const { themeStretch } = useSettings();
  const [currentTab, setCurrentTab] = useState('Normal');

  const handleChangeTab = (event, newValue) => {
    console.log(newValue)
    setCurrentTab(newValue);
  };

  return (
    <Page title="Cages">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Cages"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Cages' }]}
        />
        <Stack spacing={5}>
          <Tabs value={currentTab} scrollButtons="auto" variant="scrollable" onChange={handleChangeTab}>
            {LOCATION_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={tab.value} value={tab.value} />
            ))}
          </Tabs>
          {LOCATION_TABS.map((tab)=>{
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>
          })}
        </Stack>
      </Container>
    </Page>
  );
}
