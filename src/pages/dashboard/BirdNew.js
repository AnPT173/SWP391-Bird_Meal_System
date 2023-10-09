import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useEffect, useState } from 'react';
import heartFill from '@iconify/icons-eva/heart-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import roundPermMedia from '@iconify/icons-ic/round-perm-media';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
// material
import { styled } from '@material-ui/core/styles';
import { useParams, Link } from 'react-router-dom';
import { Tab, Box, Card, Tabs, Container, Button } from '@material-ui/core';
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
import CreateNewBirdForm from '../../components/_dashboard/user/UserNewForm'; 

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

export default function BirdNew() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { posts, followers, friends, gallery } = useSelector((state) => state.user);
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('createBird');
  const { cageId, birdId } = useParams();

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getPosts());
    dispatch(getFollowers());
    dispatch(getFriends());
    dispatch(getGallery());
  }, [dispatch]);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Page title="Create">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create Profile"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Cages', href: PATH_DASHBOARD.cages.cards },
            { name: 'Birds', href: `${PATH_DASHBOARD.cages.root}/${cageId}/birds` },
            { name: 'Create Bird' }
          ]}
        />
        <Card sx={{ mb: 3 }}>
          
          <Box sx={{ p: 3 }}>
        <CreateNewBirdForm />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
