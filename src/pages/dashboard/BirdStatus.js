import { useEffect, useState } from 'react';
import { Container, Box, Stack, Grid, Skeleton } from '@material-ui/core';
import { useDispatch, useSelector } from '../../redux/store';
import { getUsers } from '../../redux/slices/user';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import StatusForm from '../../components/_dashboard/user/StatusForm';
import foodPlanData from '../../utils/mock-data/foodPlan';

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
  const { users } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      dispatch(getUsers());
    }, 20);
  }, [dispatch]);
  const currentPlan = foodPlanData;
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
          <StatusForm isEdit currentPlan={currentPlan} />
          </Box>
        </Stack>
      </Container>
    </Page>
  );
}
