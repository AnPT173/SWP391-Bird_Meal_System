import { useEffect, useState } from 'react';
import { Container, Grid, Skeleton } from '@material-ui/core';
import { useDispatch, useSelector } from '../../redux/store';
import { getUsers } from '../../redux/slices/user';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import FoodPlanCard from '../../components/_dashboard/user/cards/FoodPlanCards';
import FoodPlanData from '../../utils/mock-data/foodPlan'; 

const SkeletonLoad = (
  <>
    {[...Array(8)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);

export default function FoodPlanCards() {
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

  return (
    <Page title="Food Plan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Food Plan"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Food Plan' }]}
        />
        {loading ? (
          SkeletonLoad
        ) : (
          <Grid container spacing={3}>
            {FoodPlanData.map((foodPlan, index) => (
              <FoodPlanCard key={index} foodPlan={foodPlan} />
            ))}
          </Grid>
        )}
      </Container>
    </Page>
  );
}
