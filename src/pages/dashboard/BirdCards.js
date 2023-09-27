import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import listTask from '@iconify/icons-bi/list-task';
// material
import { Button, Container, Grid, Skeleton } from '@material-ui/core';
import { Link as RouterLink, useParams } from 'react-router-dom';

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
import { BirdCard } from '../../components/_dashboard/user/cards';

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

export default function BirdCards() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const { cageId } = useParams();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      dispatch(getUsers());
    }, 2000);
  }, [dispatch]);

  return (
    <Page title="Birds">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Birds"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Cages', href: PATH_DASHBOARD.cages.cards },
            { name: 'Birds', href: PATH_DASHBOARD.cages.birds }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={`${PATH_DASHBOARD.cages.root}/${cageId}/schedule`}
              startIcon={<Icon icon={listTask} />}
            >
              View Feeding Schedule
            </Button>
          }
        />
          {loading ? (
            SkeletonLoad
          ) : (      
            <BirdCard cageId={cageId}/>
          )
          }
          {!users.length && SkeletonLoad}
      </Container>
    </Page>
  );
}
