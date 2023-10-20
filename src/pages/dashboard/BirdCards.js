import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import listTask from '@iconify/icons-bi/list-task';
import { Button, Container, Grid, Skeleton, Dialog, DialogContent } from '@material-ui/core';
import { Link as RouterLink, useParams } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUsers } from '../../redux/slices/user';

// Routes
import { PATH_DASHBOARD } from '../../routes/paths';

// Hooks
import useSettings from '../../hooks/useSettings';

// Components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { BirdCard } from '../../components/_dashboard/user/cards';

import CreateNewBirdForm from '../../components/_dashboard/user/UserNewForm';
import { getBirdList } from '../../redux/slices/bird';

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
  const { birdList } = useSelector((state) => state.bird);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      dispatch(getUsers());
    }, 200);
    dispatch(getBirdList());
  }, [dispatch]);

  const [openCreateBirdDialog, setOpenCreateBirdDialog] = useState(false);

  const handleOpenCreateBirdDialog = () => {
    setOpenCreateBirdDialog(true);
  };

  const handleCloseCreateBirdDialog = () => {
    setOpenCreateBirdDialog(false);
  };

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
            <>
              <Button
                variant="contained"
                component={RouterLink}
                to={`${PATH_DASHBOARD.cages.root}/${cageId}/schedule`}
                startIcon={<Icon icon={listTask} />}
              >
                View Feeding Schedule
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to={`${PATH_DASHBOARD.cages.root}/${cageId}/birds/create`}
                sx={{ ml: 1 }}
              >
                Create Bird
              </Button>
            </>
          }
        />
        <Grid container spacing={3}>
          {loading ? SkeletonLoad : <BirdCard cageId={cageId} birdData={birdList} />}
        </Grid>
      </Container>
    </Page>
  );
}
