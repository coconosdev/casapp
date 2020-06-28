import React from 'react';
import spinner from '../img/spinner.gif';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const Spinner = () => (
  <Grid container direction="row" justify="center" alignItems="center">
    <CircularProgress />
  </Grid>
);

export default Spinner;
