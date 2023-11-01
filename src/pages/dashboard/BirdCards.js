import listTask from '@iconify/icons-bi/list-task';
import { Icon } from '@iconify/react';
import { Button, Container, Grid, Skeleton } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

// Redux
import { getUsers } from '../../redux/slices/user';
import { useDispatch, useSelector } from '../../redux/store';

// Routes
import { PATH_DASHBOARD } from '../../routes/paths';

// Hooks
import useSettings from '../../hooks/useSettings';

// Components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import { BirdCard } from '../../components/_dashboard/user/cards';

import { getBirdInCageList, getBirdList } from '../../redux/slices/bird';

export default function BirdCards() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { cageId } = useParams();
  console.log("cage id", cageId)
  const { birdList, birdInCage } = useSelector((state) => state.bird);

  useEffect(() => {
    dispatch(getBirdList());
    dispatch(getBirdInCageList());
  }, []);
  
  return (
    <Page title="Birds">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Birds"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Cages', href: PATH_DASHBOARD.cages.cards },
            { name: 'cage xx', href: PATH_DASHBOARD.cages.birds }
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
          <BirdCard cageId={cageId} birdList={birdList} birdInCage={birdInCage} />
        </Grid>
      </Container>
    </Page>
  );
}
