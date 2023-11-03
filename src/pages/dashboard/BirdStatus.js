import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
// material
import { Box, Container, Grid, Skeleton, Stack } from '@material-ui/core';
// redux
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import NewFoodNormForm from '../../components/_dashboard/user/NewFoodNormForm';
import useSettings from '../../hooks/useSettings';
import { getCurrentFoodPlan, getFoodList } from '../../redux/slices/food';
import { useDispatch, useSelector } from '../../redux/store';
import { PATH_DASHBOARD } from '../../routes/paths';
import { foodsData } from '../../utils/mock-data/food';



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



  
  function BirdStatus() {
    const dispatch = useDispatch();
    const themeStretch = true; 
    const currentPlan = foodsData;
  
    useEffect(() => {

    }, []);
  return (
    <Page title="Food Plan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Food Plan"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'List', href: PATH_DASHBOARD.food.card },
          { name: 'Food Plan' }]}
        />
        <Stack spacing={5}>
          <Box>
          <NewFoodNormForm isEdit currentPlan={currentPlan} />
          </Box>
        </Stack>
      </Container>
    </Page>
  );
}}
