import { useEffect, useState } from 'react';
// material
import { Card, Container } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom'; // Import Link from react-router-dom
// redux
import useAuth from '../../hooks/useAuth';
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';

import BirdProfile from '../../components/_dashboard/user/BirdProfileForm';
import { getBirdList } from '../../redux/slices/bird';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function BirdProfileWrapper() { // Rename the component to avoid conflicts
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { birdProfile } = useSelector((state) => state.user);
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('profile');
  const { cageId, birdId } = useParams();

  const [currentBird, setCurrentBird] = useState();

  const { birdList } = useSelector(state => state.bird);

  useEffect(async () => {
    dispatch(getBirdList());
  }, []);

  useEffect(() => {
    const current = birdList.find(item => item.id === +birdId);
    setCurrentBird(current);
  }, [birdList])


  return (
    <Page title="Bird Profile">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Bird Profile"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Cages', href: PATH_DASHBOARD.cages.cards },
            { name: 'Birds', href: `${PATH_DASHBOARD.cages.root}/${cageId}/birds` },
            { name: 'Bird Profile', href: `${PATH_DASHBOARD.cages.root}/${cageId}/birds/${birdId}` }
          ]}
        />
        <Card
          sx={{
            mb: 3,
          }}
        >
          <BirdProfile currentBird={currentBird} />
        </Card>
      </Container>
    </Page>
  );
}
