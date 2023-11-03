import { Grid, Typography } from '@material-ui/core';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const getStatusColor = (status) => {
    console.log('status', status)
    switch (status) {
        case 1:
            return '#808080';
        case 2:
            return '#94D82D';
        case 3:
            return '#FFC107';
        case 4:
            return '#FF4842';
        default:
            return '#808080';
    }
};

function CageLabel({ id, title, quantity, onClick, color }) {
    // const color = getStatusColor(status);
    console.log('color', color)
    return (
        <Typography
            onClick={() => onClick(id)}
            variant="h6"
            align="center"
            style={{ backgroundColor: color, 'border-radius': '5px', 'margin-bottom': '5px' }}
        >
            {`Cage ${title}`}
            <br/>
            {quantity}
           
        </Typography>
    );
}

export default function LocationScheduleMap(props) {
    return (
        <Grid container spacing={1} style={{ margin: '5px 5px 10px 5px' }}>
            {props?.data?.map((item, index) => (
                <Grid item xs={4} key={index}>
                    <CageLabel
                        id={item.id}
                        title={item.cageId}
                        quantity={item?.foods[0]?.quantity ?? 10}
                        onClick={props.onClick}
                        color={item.color}
                    />
                </Grid>

            ))}
        </Grid>
    );
}