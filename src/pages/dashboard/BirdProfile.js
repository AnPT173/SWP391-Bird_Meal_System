import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useEffect, useState } from 'react';
import heartFill from '@iconify/icons-eva/heart-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import roundPermMedia from '@iconify/icons-ic/round-perm-media';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
// material
import { styled } from '@material-ui/core/styles';
import { useParams, Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Tab, Box, Card, Tabs, Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getPosts, getGallery, getFriends, getProfile, getFollowers, onToggleFollow } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

import BirdProfile from '../../components/_dashboard/user/BirdProfileForm';
import { getBirdData } from '../../utils/mock-data/localStorageUtil';
import { getBirdList } from '../../redux/slices/bird';
// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center'
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3)
  }
}));

// ----------------------------------------------------------------------

export default function BirdProfileWrapper() {
  // Rename the component to avoid conflicts
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { cageId, birdId } = useParams();

  const [currentBird, setCurrentBird] = useState();

  const { birdList } = useSelector(state => state.bird);

  useEffect(async() => {
    dispatch(getBirdList());
  }, []);

  useEffect(()=>{
    const current = birdList.find(item => item.id === birdId);
    setCurrentBird(current);
  },[birdList])


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
            mb: 3
          }}
        >
          <BirdProfile isEdit currentBird={currentBird} />
        </Card>
      </Container>
    </Page>
  );
}
