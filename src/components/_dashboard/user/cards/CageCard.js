import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Typography, Divider, Link, styled } from '@material-ui/core';
import { cagesData } from '../../../../utils/mock-data/cage';
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

const CoverImgStyle = styled('img')({
  top: 0,
  zIndex: 8,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

function CageCard() {
  return (
    <Grid container spacing={3}>
      {cagesData.map((cage, index) => (
        <Grid item xs={12} sm={6} md={4} key={cage.cageID}>
          <Card>
            <CardMediaStyle>
              <CoverImgStyle
                alt="cover"
                src={`/static/mock-images/cages/cage_${index + 1}.jpg`}
              />
            </CardMediaStyle>
            <Link href={`${PATH_DASHBOARD.cages.root}/${cage.cageID}/birds`}>
              <Typography variant="subtitle1" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
                Cage ID: {cage.cageID}
              </Typography>
            </Link>
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', marginTop: 1 }}>
              Species: {cage.species}
            </Typography>
            <Divider />
            <Grid container sx={{ py: 3, textAlign: 'center' }}>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                  Birds
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {cage.numberOfBirds}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                  Cage Type
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {cage.cageType}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                  Status
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {cage.status}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

CageCard.propTypes = {
  cageId: PropTypes.string.isRequired,
};

export default CageCard;
