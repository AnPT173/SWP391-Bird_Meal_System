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
import NewFoodNormForm from '../../components/_dashboard/user/NewFoodNormForm';
import { getCurrentFoodPlan, getFoodList } from '../../redux/slices/food';


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


export default function BirdStatus() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { foodList } = useSelector(state => state.food);
  const [currentFoodPlan, setCurrentFoodPlan] = useState();
  const [currentTab, setCurrentTab] = useState('Normal');
  const { speciesId, periodId } = useParams();

  useEffect(() => {
    dispatch(getFoodList());
  }, [])

  useEffect(() => {
    const foodPlan = getCurrentFoodPlan(1,1, foodList);
    setCurrentFoodPlan(foodPlan);
  }, [foodList])

  const STATUS_TABS = [
    {
      value: 'Normal',
      component: <NewFoodNormForm currentPlan={currentFoodPlan} />
    },
    {
      value: 'Sick',
      component: <NewFoodNormForm currentPlan={currentFoodPlan} />
    },
    {
      value: 'Birth',
      component: <NewFoodNormForm currentPlan={currentFoodPlan} />
    },
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };



  console.log('species', speciesId, periodId)

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
