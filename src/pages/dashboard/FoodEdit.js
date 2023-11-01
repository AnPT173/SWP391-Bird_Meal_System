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
import StatusForm from '../../components/_dashboard/user/StatusForm';
// redux
import { foodsData } from '../../utils/mock-data/food';
import FoodEditForm from '../../components/_dashboard/user/FoodEditForm';
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

export default function FoodEditPage() { 
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const chosenProduct = useSelector(state => state.user.chosenProduct) || {};
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('profile');
  const { cageId, birdId } = useParams();
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  const handleEditProduct = (productId) => {
    const productToEdit = foodsData.find(product => product.id === productId);
    setCurrentProduct(productToEdit);
  }
  return (
    <Page title="Edit">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit Product"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Storage', href: PATH_DASHBOARD.food.list },
            { name: 'Edit'},
          ]}
        />
        <Card
          sx={{
            mb: 3,
          }}
        >
          <StatusForm
        isEdit
        currentProduct={currentProduct}
          />
        </Card>
      </Container>
    </Page>
  );
}
