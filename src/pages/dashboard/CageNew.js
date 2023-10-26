import { useState, useEffect } from 'react';
// material
import { Box, Card, Container } from '@material-ui/core';
import CreateNewCageForm from '../../components/_dashboard/user/NewCageForm';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import { getCurrentLocation } from '../../utils/mock-data/localStorageUtil';



export default function CageNew() {

  const [currentLocation, setCurrentLocation] = useState('');
  useEffect(async ()=>{
    const location = await getCurrentLocation();
    setCurrentLocation(location);
  },[])

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
            <CreateNewCageForm location={currentLocation}/>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
