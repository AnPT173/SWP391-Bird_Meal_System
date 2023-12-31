import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Card, Grid, Avatar, Tooltip, Divider, Typography, IconButton } from '@material-ui/core';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
//
import SvgIconStyle from '../../../SvgIconStyle';

// ----------------------------------------------------------------------

const SOCIALS = [
  {
    name: 'Facebook',
    icon: <Icon icon={facebookFill} width={20} height={20} color="#1877F2" />
  },
  {
    name: 'Instagram',
    icon: <Icon icon={instagramFilled} width={20} height={20} color="#D7336D" />
  },
  {
    name: 'Linkedin',
    icon: <Icon icon={linkedinFill} width={20} height={20} color="#006097" />
  },
  {
    name: 'Twitter',
    icon: <Icon icon={twitterFill} width={20} height={20} color="#1C9CEA" />
  }
];

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
    WebkitBackdropFilter: 'blur(3px)' // Fix on Mobile
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

function InfoItem(number) {
  return (
    <Grid item xs={4}>
      <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', display: 'block' }}>
        Follower
      </Typography>
      <Typography variant="subtitle1">{fShortenNumber(number)}</Typography>
    </Grid>
  );
}

UserCard.propTypes = {
  user: PropTypes.object.isRequired
};

export default function UserCard({ user, ...other }) {
  const { name, cover, position, follower, totalPost, following } = user;

  return (
    <Card {...other}>
      <CardMediaStyle>
        <CoverImgStyle alt="cover" src={cover} />
      </CardMediaStyle>

      <Typography variant="subtitle1" align="center" sx={{ mt: 6 }}>
        {name}
      </Typography>
      <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
        {position}
      </Typography>

      <Box sx={{ textAlign: 'center', mt: 2, mb: 2.5 }}>
        {SOCIALS.map((social) => (
          <Tooltip key={social.name} title={social.name}>
            <IconButton>{social.icon}</IconButton>
          </Tooltip>
        ))}
      </Box>

      <Divider />

      <Grid container sx={{ py: 3, textAlign: 'center' }}>
        {InfoItem(follower)}
        {InfoItem(following)}
        {InfoItem(totalPost)}
      </Grid>
    </Card>
  );
}
