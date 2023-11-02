import { useState } from 'react';
// material
import { Card, Container } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom'; // Import Link from react-router-dom
import NewFoodNormForm from '../../components/_dashboard/user/NewFoodNormForm';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { foodsData } from '../../utils/mock-data/food';
import Page from '../../components/Page';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
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
          <NewFoodNormForm
        isEdit
        currentProduct={currentProduct}
          />
        </Card>
      </Container>
    </Page>
  );
}
