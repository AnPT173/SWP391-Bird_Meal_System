import PropTypes from 'prop-types';
// material
import { useParams } from 'react-router';
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Card, Grid, Avatar, Tooltip, Divider, Typography, IconButton, Link } from '@material-ui/core';
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
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)', // Fix on Mobile
    borderTopLeftRadius: theme.shape.borderRadiusMd,
    borderTopRightRadius: theme.shape.borderRadiusMd,
    backgroundColor: alpha(theme.palette.primary.darker, 0.72)
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
      {birdsInCage.map((bird, index) => (
        <Grid item xs={12} sm={6} md={4} key={bird.birdId}>
          <Card key={bird.birdId}>
            <CardMediaStyle>
              <SvgIconStyle
                color="paper"
                src="/static/icons/shape-avatar.svg"
                sx={{
                  width: 144,
                  height: 62,
                  zIndex: 10,
                  bottom: -26,
                  position: 'absolute',
                }}
              />
              <Avatar
                alt={bird.birdName}
                src={`/static/mock-images/birds/bird_${index + 1}.jpg`}
                sx={{
                  width: 64,
                  height: 64,
                  zIndex: 11,
                  position: 'absolute',
                  transform: 'translateY(-50%)',
                }}
              />
              <CoverImgStyle
                alt="cover"
                src={`/static/mock-images/cages/cage_${index + 1}.jpg`}
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
                  Quantity
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {bird.foodQuantity} gr
                </Typography>
              </Grid>              
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                  Status
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {bird.status}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      ))
      }
    </Grid >
  );
}
