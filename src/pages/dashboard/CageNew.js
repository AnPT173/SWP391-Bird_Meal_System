import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import React, { useEffect, useState } from 'react';
import heartFill from '@iconify/icons-eva/heart-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import roundPermMedia from '@iconify/icons-ic/round-perm-media';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
// material
import { styled } from '@material-ui/core/styles';
import { useParams, Link } from 'react-router-dom';
import { Tab, Box, Card, Tabs, Container, Button } from '@material-ui/core';
import CreateNewCageForm from '../../components/_dashboard/user/NewCageForm';

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


const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
}));

export default function CageNew() {
  const [currentTab, setCurrentTab] = React.useState('createCage');

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Page title="Create Cage">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Create Cage"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Cages', href: PATH_DASHBOARD.cages.cards },
            { name: 'Create Cage' },
          ]}
        />
        <Card sx={{ mb: 3 }}>
          <Box sx={{ p: 3 }}>
            {currentTab === 'createCage' && <CreateNewCageForm />}
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
