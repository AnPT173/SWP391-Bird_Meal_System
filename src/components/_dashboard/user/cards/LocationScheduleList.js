import { Grid, Typography } from '@material-ui/core';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const getStatusColor = (status) => {
    switch (status) {
        case 'Feeded':
            return '#94D82D';
        case 'Pending':
            return '#FFC107';
        case 'Late':
            return '#FF4842';
        default:
            return '#00AB55';
    }
};

function CageLabel({ id, title, quantity, onClick, status }) {
    const color = getStatusColor(status);
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
                        quantity={item.foodQuantity}
                        onClick={props.onClick}
                        status={item.status}
                    />
                </Grid>

            ))}
        </Grid>
    );
}