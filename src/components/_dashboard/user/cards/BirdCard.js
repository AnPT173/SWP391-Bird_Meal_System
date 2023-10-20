import PropTypes from 'prop-types';
// material
import { useParams } from 'react-router';
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Card, Grid, Avatar, Tooltip, Divider, Typography, IconButton, Link } from '@material-ui/core';
import Label from '../../../Label';
import { birdsData } from '../../../../utils/mock-data/bird';
// utils
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { fShortenNumber } from '../../../../utils/formatNumber';
//
import SvgIconStyle from '../../../SvgIconStyle';


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
  zIndex: 8,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------



BirdCard.propTypes = {
  cageId: PropTypes.string.isRequired,
};

export default function BirdCard({ cageId }) {
  const birdsInCage = birdsData.filter((bird) => bird.cageId === cageId);
  return (
    <Grid container spacing={3}>
      {birdsInCage.map((bird, index) => {
        let statusColor = 'info'; 

        if (bird.status === 'Normal') {
          statusColor = 'success'; 
        } else if (bird.status === 'Sick') {
          statusColor = 'error'; 
        } else if (bird.status === 'Birth') {
          statusColor = 'warning'; 
        }

        return (
        <Grid item xs={12} sm={6} md={4} key={bird.birdId}>
          <Card key={bird.birdId}>
            <CardMediaStyle>
              <CoverImgStyle
                alt="cover"
                src={`/static/mock-images/birds/bird_${index + 1}.jpg`}
              />
            </CardMediaStyle>
            <Link href={`${PATH_DASHBOARD.cages.root}/${bird.cageId}/birds/${bird.birdId}/profile`}>
              <Typography variant="subtitle1" align="center" sx={{ mt: 6 }}>
                {bird.birdName}
              </Typography>
            </Link>
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
              {bird.species}
            </Typography>
            <Divider />
            <Grid container sx={{ py: 3, textAlign: 'center' }}>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                  Age
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {bird.birdAge}
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
                    bottom: 24, 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                  }}
                >
                  {bird.status}
                </Label>
                </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                  Hatch Date
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {bird.hatchingDate} 
                </Typography>
              </Grid>               
              </Grid>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
