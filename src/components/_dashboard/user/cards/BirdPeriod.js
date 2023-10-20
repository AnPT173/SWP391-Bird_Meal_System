import PropTypes from 'prop-types';
// material
import { useParams } from 'react-router';
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Card, Grid, Avatar, Tooltip, Divider, Typography, IconButton, Link } from '@material-ui/core';
import { species } from 'src/utils/mock-data/species';
import { periodData } from 'src/utils/mock-data/period';
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


export default function PeriodCard() {
  const { speciesID } = useParams();
  return (
    <Grid container spacing={3}>
      {periodData.map((period) => (
        <Grid item xs={12} sm={6} md={4} key={period.periodId}>
          <Card key={period.periodId}>
            <CardMediaStyle>
              <CoverImgStyle
                alt="cover"
                src={`/static/mock-images/cages/cage_${index + 1}.jpg`}
              />
            </CardMediaStyle>

            <Link href={`${PATH_DASHBOARD.food.species}/${speciesID}/period/${period.periodId}/status`}>
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
              {period.period}
            </Typography>
            </Link>
            <Divider />
          </Card>
        </Grid>
      ))
      }
    </Grid >
  );
}
