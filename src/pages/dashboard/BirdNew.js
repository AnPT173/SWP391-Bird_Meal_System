import { useEffect, useState } from 'react';
// material
import { Box, Card, Container } from '@material-ui/core';
// redux
// routes
import { useParams } from 'react-router';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import NewBirdForm from '../../components/_dashboard/user/NewBirdForm';
import { getCurrentBirdTypeName, getCurrentLocation } from '../../utils/mock-data/localStorageUtil';

export default function BirdNew() {
  const { themeStretch } = useSettings();
  const [currentLocation, setCurrentLocation] = useState();
  const [birdTypeName, setBirdTypeName] = useState();

  const { cageId } = useParams();
  useEffect(async()=>{
    const data = await getCurrentLocation();
    const birdType = await getCurrentBirdTypeName();
    setCurrentLocation(data);
    setBirdTypeName(birdType);
  },[])

  console.log(birdTypeName)

  return (
    <Page title="Create">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create Bird"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: `Cage ${cageId}`, href: PATH_DASHBOARD.cages.cards },
            { name: 'Birds', href: `${PATH_DASHBOARD.cages.root}/${cageId}/birds` },
            { name: 'Create Bird' }
          ]}
        />
        <Card sx={{ mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <NewBirdForm location={currentLocation} birdType={birdTypeName}/>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
