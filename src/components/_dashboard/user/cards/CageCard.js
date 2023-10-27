import React, { useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Typography, Divider, Link, styled } from '@material-ui/core';
import Label from '../../../Label';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { getCageData } from '../../../../utils/mock-data/localStorageUtil';


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

function CageCard({status}) {

  const [cagesData, setCagesData] = useState([]);

  useEffect(async ()=>{

    // saveCageData(cagesData);
    const data = await getCageData();
    setCagesData(data);
    
  },[])
  const filterdData = cagesData?.filter(item => item.type === status)

  console.log('filterd data', filterdData);

  return (
    <>
    <Grid container spacing={3}>
      {filterdData.map((cage, index) => {
        let statusColor = 'info'; 

        if (cage.type === 'Normal') {
          statusColor = 'success'; 
        } else if (cage.type === 'Birth') {
          statusColor = 'warning'; 
        } else if (cage.type === 'Sick') {
          statusColor = 'error'; 
        } else if (cage.type === 'Exotic'){
          statusColor = 'secondary';
        }

        return (
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
                    Feeding Regimen
                  </Typography>
                  {cage.type && (
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
                  {cage.type}
                </Label>
                )}
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                    Cage Type
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {cage.cageType}
                  </Typography>
                </Grid>  
              </Grid>
            </Card>
          </Grid>
        );
      })}
    </Grid>
    {!filterdData && <Typography variant="body2" align="center">
        No cage for this location
      </Typography>}
    </>
  );
}


export default CageCard;
