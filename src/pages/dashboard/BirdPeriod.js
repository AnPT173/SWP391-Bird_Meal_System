import { useEffect, useState } from 'react';
// material
import { Container, Grid, Skeleton } from '@material-ui/core';
// redux
import { useDispatch } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import PeriodCard from '../../components/_dashboard/user/cards/PeriodCard';

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

export default function PeriodCards() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
     
    }, 20);
  }, [dispatch]);



  return (
    <Page title="Periods">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Periods"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Species', href: PATH_DASHBOARD.food.species },
            { name: 'Period'}]}
        />
          {loading ? (
            SkeletonLoad
          ) : (      
            <PeriodCard/>
          )
          }
      </Container>
    </Page>
  );
}
