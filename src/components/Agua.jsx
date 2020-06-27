import React, { useState, useEffect } from 'react';
import * as FirestoreService from '../services/firestore';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

function Agua() {
  const [selectedDate, setSelectedDate] = useState('');
  const [waterDays, setWaterDays] = useState([]);

  useEffect(() => {
    const unsubscribe = FirestoreService.streamAguaList({
      next: (querySnapshot) => {
        const updatedWater = querySnapshot.docs
          .map((doc) => {
            const id = doc.id;
            const data = doc.data();
            return { id, ...data };
          })
          .sort((a, b) => {
            if (a.date < b.date) {
              return -1;
            }
            if (a.date > b.date) {
              return 1;
            }
            return 0;
          });
        setWaterDays(updatedWater);
      },
      error: () => {
        console.log('error observer');
      },
    });
    return unsubscribe;
  }, [setWaterDays]);

  const handleDate = (e) => {
    setSelectedDate(e.target.value);
  };

  const deleteDay = (id) => {
    FirestoreService.deleteAgua(id)
      .then(() => {})
      .catch((e) => console.log('error masivo delete', e));
  };

  const addWater = (date) => {
    setSelectedDate('');
    FirestoreService.addAgua(date)
      .then(() => {})
      .catch((e) => console.log('error masivo create', e));
  };

  const getAverageDifference = (arr) => {
    let avg = 0;
    arr = arr.slice(-10);
    if (arr.length > 1) {
      for (let i = 1; i < arr.length; i++) {
        const prevDate = moment(arr[i - 1].date);
        const date = moment(arr[i].date);
        const diff = date.diff(prevDate, 'days');
        avg += diff;
      }
      avg = avg / arr.length;
      return Math.ceil(avg);
    }
    return 0;
  };

  return (
    <div className="agua-component">
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-end"
      >
        <TextField
          label="Fecha de caída"
          type="date"
          defaultValue=""
          name="fecha"
          onChange={handleDate}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedDate}
          fullWidth={false}
          className="ml-15"
          onClick={() => addWater(selectedDate)}
        >
          +
        </Button>
      </Grid>
      <TableContainer component={Paper} className="mt-30">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Día</TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {waterDays.slice(-10).map((obj) => (
              <TableRow key={obj.id}>
                <TableCell>{moment(obj.date).format('dddd, LL')}</TableCell>
                <TableCell>
                  <DeleteIcon onClick={() => deleteDay(obj.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {waterDays.length > 1 && (
        <Paper elevation={3} className="mt-30 p15">
          <Typography variant="body1">
            <b>Próxima predicción:</b>
          </Typography>
          <Typography variant="body2">
            {moment(waterDays.slice(-1)[0].date)
              .add(getAverageDifference(waterDays), 'days')
              .format('dddd, LL')}
          </Typography>
          <Typography variant="body2">
            En {getAverageDifference(waterDays)} día
            {getAverageDifference(waterDays) > 1 ? 's' : ''}
          </Typography>
        </Paper>
      )}
    </div>
  );
}

export default Agua;
