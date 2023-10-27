import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Typography, Divider, Link, styled } from '@material-ui/core';
import Label from '../../../Label';
import { PATH_DASHBOARD } from '../../../../routes/paths';

const CardMediaStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
  paddingTop: 'calc(100% * 9 / 16)',
  '&:before': {
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
    WebkitBackdropFilter: 'blur(3px)', // Fix on Mobile
  },
}));
FoodPlanCard.propTypes = {
    isEdit: PropTypes.bool,
    currentPlan: PropTypes.object,
  };
function FoodPlanCard({ foodPlan }) {
  let statusColor = 'info';

  if (foodPlan.status === 'Normal') {
    statusColor = 'success';
  } else if (foodPlan.status === 'Sick') {
    statusColor = 'error';
  } else if (foodPlan.status === 'Birth') {
    statusColor = 'warning';
  }

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ bgcolor: statusColor }}>
        <Link href={`${PATH_DASHBOARD.food.card}/${foodPlan.name}/edit`}>
          <Typography variant="subtitle1" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
            {foodPlan.name}
          </Typography>
        </Link>
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', marginTop: 1 }}>
          Species: {foodPlan.species}
        </Typography>
        <Divider />
        <Grid container sx={{ py: 3, textAlign: 'center' }}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
              Period
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {foodPlan.period}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
              Status
            </Typography>
            <Label
                  color={statusColor} 
                  sx={{
                    textTransform: 'uppercase',
                    position: 'absolute',
                    bottom: 23, 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                  }}
                >
              {foodPlan.status}
            </Label>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
              Number of Feedings
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {foodPlan.numberOfFeedings}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}

export default FoodPlanCard;
