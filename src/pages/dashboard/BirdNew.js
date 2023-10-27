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

export default function BirdNew() {
  const { themeStretch } = useSettings();
  const { cageId } = useParams();

  return (
    <Page title="Create">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create Bird"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Cages', href: PATH_DASHBOARD.cages.cards },
            { name: 'Birds', href: `${PATH_DASHBOARD.cages.root}/${cageId}/birds` },
            { name: 'Create Bird' }
          ]}
        />
        <Card sx={{ mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <CreateNewBirdForm  cageId/>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
