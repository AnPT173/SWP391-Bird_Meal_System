import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Stack,
  Tab,
  Tabs,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link as RouterLink } from 'react-router-dom';
import Page from '../../components/Page';
import CageCard from '../../components/_dashboard/user/cards/CageCard';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { buildCurrentLocationCageList, getCageList } from '../../redux/slices/cage';
import { PATH_DASHBOARD } from '../../routes/paths';
import { createLocation, getLocationList } from '../../redux/slices/location';
import { saveCurrentLocation } from '../../utils/mock-data/localStorageUtil';
import { getBirdInCageList } from '../../redux/slices/bird';

export default function CageCards() {
  const dispatch = useDispatch();
  const { cageList } = useSelector((state) => state.cage);
  const { birdInCage } = useSelector((state) => state.bird);
  const { locationList } = useSelector(state => state.location);
  const [currentTab, setCurrentTab] = useState("L01");

  const [isCreateLocationDialogOpen, setCreateLocationDialogOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [locationToUpdate, setLocationToUpdate] = useState(null);


  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
    const currentLocation = locationList.find(item => item.name === newValue);
    saveCurrentLocation(currentLocation)
  };

  const handleOpenCreateLocationDialog = () => {
    setCreateLocationDialogOpen(true);
  };

  const handleCloseCreateLocationDialog = () => {
    setCreateLocationDialogOpen(false);
  };

  const handleCreateLocation = () => {
    if (newLocationName.trim() === '') {
      return;
    }

    const newLocation = {
      name: newLocationName,
    };

    dispatch(createLocation(newLocation));
    // setUpdatedLocations((prevLocations) => [...prevLocations, newLocation]);
    setNewLocationName('');
    handleCloseCreateLocationDialog();
  };


  const handleDeleteLocation = (locationId) => {
    const updatedLocations = updatedLocations.filter((location) => location.id !== locationId);
    // call DELETE api

    // setUpdatedLocations(updatedLocations);

    // Automatically switch to the first location if the current one is deleted
    if (currentTab === updatedLocations.find((location) => location.id === locationId).name) {
      setCurrentTab(updatedLocations[0].name);
    }
  };

  const handleUpdateLocation = (locationId) => {
    const location = locationList.find((loc) => loc.id === locationId);

    if (!location) {
      return;
    }

    setLocationToUpdate(location);
    setUpdateDialogOpen(true);
  };

  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
  };

  const handleLocationNameChange = (event) => {
    if (locationToUpdate) {
      setLocationToUpdate({
        ...locationToUpdate,
        name: event.target.value,
      });
    }
  };

  const handleUpdateLocationConfirm = () => {
    // if (locationToUpdate) {
    //   const updatedLocations = locationList.map((location) =>
    //     location.id === locationToUpdate.id ? locationToUpdate : location
    //   );
    //   // setUpdatedLocations(updatedLocations);
    //   setUpdateDialogOpen(false);
    // }
  };
  useEffect(() => {
    saveCurrentLocation({
      id: 1,
      name: "L01"
    })
    dispatch(getCageList());
    dispatch(getLocationList());
    dispatch(getBirdInCageList());
  }, []);

  return (
    <Page title="Cages">
      <Container>
        <HeaderBreadcrumbs
          heading="Cages"
          links={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Cages' }]}
        />
        <Button
          variant="contained"
          onClick={handleOpenCreateLocationDialog}
          sx={{
            position: 'absolute',
            top: 80,
            right: 210,
            mt: 2,
            mr: 2,
            bgcolor: 'secondary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'secondary.dark',
            },
          }}
        >
          Create Location
        </Button>
        <Button
          variant="contained"
          component={RouterLink}
          to={`${PATH_DASHBOARD.cages.root}/create?area=${encodeURIComponent(currentTab)}`}
          sx={{
            position: 'absolute',
            top: 80,
            right: 50,
            mt: 2,
            mr: 2,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Create New Cage
        </Button>

        <Stack spacing={5}>
          <Tabs value={currentTab} scrollButtons="auto" variant="scrollable" onChange={handleChangeTab}>
            {locationList.map((location) => (
              <Tab
                disableRipple
                key={location.id}
                label={location.name}
                value={location.name}
              />
            ))}
          </Tabs>
          {locationList.map((location) => {
            const isMatched = location.name === currentTab;
            const cages = buildCurrentLocationCageList(location.id, cageList, birdInCage);
            return isMatched && (
              <Box key={location.id}>
                <CageCard cageList={cages}/>
                <IconButton
                  onClick={() => handleUpdateLocation(location.id)}
                  sx={{ color: 'primary.main' }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteLocation(location.id)}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
        </Stack>
        <Dialog open={isCreateLocationDialogOpen} onClose={handleCloseCreateLocationDialog}>
          <DialogTitle>Create New Location</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Location Name"
              variant="outlined"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreateLocationDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCreateLocation} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isUpdateDialogOpen} onClose={handleUpdateDialogClose}>
          <DialogTitle>Update Location Name</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="New Location Name"
              variant="outlined"
              value={locationToUpdate ? locationToUpdate.name : ''}
              onChange={handleLocationNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateLocationConfirm} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}
