import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// material
import { Card, Divider, Grid, Link, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import Label from '../../../Label';
// utils
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { buildCurrentBirdInfo, getBirdAge } from '../../../../redux/slices/bird';
import SearchNotFound from '../../../SearchNotFound';
//

// ----------------------------------------------------------------------

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
    borderTopLeftRadius: theme.shape.borderRadiusMd,
    borderTopRightRadius: theme.shape.borderRadiusMd,
  }
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

BirdCard.propTypes = {
  cageId: PropTypes.number,
  birdList: PropTypes.array,
  birdInCage: PropTypes.array
};

export default function BirdCard({ cageId, birdList, birdInCage }) {

  console.log('bird in cage', birdInCage);

  let filteredBirdInCage = [];
  filteredBirdInCage = birdInCage?.filter(item => item?.cageid?.id === +cageId)

  console.log('bird in cage', filteredBirdInCage);

  return (
    <>
      <Grid container spacing={3}>
        {filteredBirdInCage && filteredBirdInCage?.map((bird, index) => {
          const currentBird = buildCurrentBirdInfo(cageId, bird?.birdID?.id, birdList, filteredBirdInCage);
          console.log('current bird', currentBird);
          let statusColor = 'info';
          const birdImageUrl = currentBird?.image ?? `/static/mock-images/birds/bird_${index + 1}.jpg`;

          if (bird?.status === 'Normal') {
            statusColor = 'success';
          } else if (bird?.status === 'Sick') {
            statusColor = 'error';
          } else if (bird?.status === 'Birth') {
            statusColor = 'warning';
          } else {
            statusColor = 'success';
          }

          return (
            <Grid item xs={12} sm={6} md={4} key={bird.id}>
              <Card key={currentBird.id}>
                <CardMediaStyle>
                  <CoverImgStyle
                    alt="cover"
                    src={birdImageUrl}
                  />
                </CardMediaStyle>
                <Link href={`${PATH_DASHBOARD.cages.root}/${currentBird?.cageID?.id}/birds/${currentBird.id}/profile`}>
                  <Typography variant="subtitle1" align="center" sx={{ mt: 6 }}>
                    {currentBird?.birdid?.name}
                  </Typography>
                </Link>
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                  {currentBird?.birdid?.birdTypeid?.specieid?.name}
                </Typography>
                <Divider />
                <Grid container sx={{ py: 3, textAlign: 'center' }}>
                  <Grid item xs={4}>
                    {/* age or hatching date */}
                    <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                      Age
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {getBirdAge(currentBird?.birdid?.age)}
                    </Typography>
                  </Grid>
                  {/* tinh trang suc khoa */}
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                      Status
                    </Typography>
                    <Label
                      color={statusColor}
                      sx={{
                        textTransform: 'uppercase',
                        position: 'absolute',
                        bottom: 24,
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      {currentBird?.status}
                    </Label>
                  </Grid>
                  <Grid item xs={4}>
                    {/* id long */}
                    <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                      Hatch Date
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {currentBird?.startDate}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {birdList && birdList?.length === 0 && (
        <SearchNotFound searchQuery='No bird for this cage'/>
      )}
    </>
  );
}
