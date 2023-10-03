import { useEffect, useState } from 'react';
// material
import { Container, Grid, Skeleton } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUsers } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import SpeciesCard from '../../components/_dashboard/user/cards/BirdSpeciesCard';

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

export default function SpeciesCards() {
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
    <Page title="Species">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Species"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, 
                  { name: 'Species' }]}
        />
        <Grid container spacing={3}>
          {loading ? (
            SkeletonLoad
          ) : (
      
            <SpeciesCard />
          )
          }
          {!users.length && SkeletonLoad}
        </Grid>
      </Container>
    </Page>
  );
}
