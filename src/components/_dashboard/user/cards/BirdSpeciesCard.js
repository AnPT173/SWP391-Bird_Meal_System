// material
import { Card, Divider, Grid, Link, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { species } from '../../../../utils/mock-data/species';


// utils
import { PATH_DASHBOARD } from '../../../../routes/paths';
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
  zIndex: 8,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------


export default function SpeciesCard() {
  return (
    <Grid container spacing={3}>
      {species.map((specie, index) => (
        <Grid item xs={12} sm={6} md={4} key={specie.speciesID}>
          <Card key={specie.speciesID}>
            <CardMediaStyle>
              <CoverImgStyle
                alt="cover"
                src={`/static/mock-images/cages/cage_${index + 1}.jpg`}
              />
            </CardMediaStyle>

            <Link href={`${PATH_DASHBOARD.food.species}/${specie.speciesID}/period`}>
              <Typography variant="subtitle1" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
              {specie.specie}
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
