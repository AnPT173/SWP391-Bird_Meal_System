import { Card, Divider, Grid, Link, Typography, styled } from '@material-ui/core';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Label from '../../../Label';
import SearchNotFound from '../../../SearchNotFound';
import { saveCurrentCurrentBirdTypeName } from '../../../../utils/mock-data/localStorageUtil';


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

function CageCard({ cageList }) {

  return (
    <>
      <Grid container spacing={3}>
        {cageList.map((cage, index) => {
          console.log('cage', cage)
          let statusColor = 'info';

        if (cage.birdTypeid.name === 'Normal') {
          statusColor = 'success'; 
        } else if (cage.birdTypeid.name === 'Birth') {
          statusColor = 'warning'; 
        } else if (cage.birdTypeid.name === 'Sick') {
          statusColor = 'error'; 
        } else if (cage.birdTypeid.name === 'Exotic'){
          statusColor = 'secondary';
        }
          // if (cage.status === 'Feeded') {
          //   statusColor = 'success';
          // } else if (cage.status === 'Pending') {
          //   statusColor = 'warning';
          // } else if (cage.status === 'Late') {
          //   statusColor = 'error';
          // }

          return (
            <Grid item xs={12} sm={6} md={4} key={cage?.id}>
              <Card>
                <CardMediaStyle>
                  <CoverImgStyle
                    alt="cover"
                    src={cage?.image ?? `/static/mock-images/cages/cage_${index + 1}.jpg`}
                  />
                </CardMediaStyle>
                <Link href={`${PATH_DASHBOARD.cages.root}/${cage.id}/birds`} onClick={async ()=> { await saveCurrentCurrentBirdTypeName(cage?.birdTypeid)}}>
                  <Typography variant="subtitle1" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
                    Cage ID: {cage.id}
                  </Typography>
                </Link>
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary', marginTop: 1 }}>
                  Species: {cage?.birdTypeid?.specieid?.name}
                </Typography>
                <Divider />
                <Grid container sx={{ py: 3, textAlign: 'center' }}>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                      Birds
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {cage.numberOfBirdInCage}
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
                        {cage.birdTypeid.name}
                      </Label>
                    
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                      Cage Type
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {cage.type}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {!cageList &&
        <SearchNotFound searchQuery='No cage for this location' />
      }
    </>
  );
}


export default CageCard;
