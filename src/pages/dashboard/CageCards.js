import { useEffect } from 'react';
import { Container, Grid, Skeleton } from '@material-ui/core';
import { useDispatch, useSelector } from '../../redux/store';
import { getUsers } from '../../redux/slices/user';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import CageCard from '../../components/_dashboard/user/cards/CageCard';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

const SkeletonLoad = (
  <>
    {[...Array(8)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);

export default function CageCards() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user); // Assuming there is a "loading" state in your Redux store

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <Page title="Cages">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Cages"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Cages' }]}
        />
        <Grid container spacing={3}>
          {loading ? (
            SkeletonLoad
          ) : users.map((user) => (
            <Grid key={user.id} item xs={12} sm={6} md={4}>
              <CageCard user={user} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
