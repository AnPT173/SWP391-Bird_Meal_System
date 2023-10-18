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
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)', // Fix on Mobile
    borderTopLeftRadius: theme.shape.borderRadiusMd,
    borderTopRightRadius: theme.shape.borderRadiusMd,
    backgroundColor: alpha(theme.palette.primary.darker, 0.72)
  }
}));

// ----------------------------------------------------------------------



AreaCard.propTypes = {
    areaId: PropTypes.array.isRequired,
  };

  export default function AreaCard({ areas }) {
    return (
      <Grid container spacing={3}>
        {areas.map((area, index) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={area.areaId}>
              <Card key={area.areaId}>
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
              </CardMediaStyle>
                <Link href={`/${PATH_DASHBOARD.area.areaId}/${area.areaId}/cages/cards`}>
                  <Typography variant="subtitle1" align="center" sx={{ mt: 6 }}>
                    {area.areaName}
                  </Typography>
                </Link>
                   
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }
