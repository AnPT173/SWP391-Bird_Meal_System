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
import { species } from 'src/utils/mock-data/species';
import { periodData } from 'src/utils/mock-data/period';
import { status } from 'src/utils/mock-data/status';

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
const STATUS = [
  { id: 1, value: 'P01' },
  { id: 2, value: 'P02' },
  { id: 3, value: 'P03' }
];

export default function StatusCard() {
  return (
    <Grid container spacing={3}>
      {STATUS.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <Card key={item.id}>
            <CardMediaStyle>
              <CoverImgStyle
                alt="cover"
                src={`/static/mock-images/cages/cage_${index + 1}.jpg`}
              />
            </CardMediaStyle>

            
          </Card>
        </Grid>
      ))
      }
    </Grid >
  );
}
