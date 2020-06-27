import React, { useState, useEffect } from 'react';
import AquaButton from './AquaButton';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';

function Agua() {
  const [selectedDate, setSelectedDate] = useState('');
  const [waterDays, setWaterDays] = useState([]);

  useEffect(() => {
    console.log('compoennt did mount');
    return () => {
      console.log('component destroy');
    };
  }, []);

  const handleDate = (e) => {
    setSelectedDate(moment(e.target.value));
  };

  const deleteDay = (id) => {
    const changed = waterDays.filter((day) => day !== id);
    setWaterDays(changed);
  };

  const getAverageDifference = (arr) => {
    let avg = 0;
    arr = arr.slice(-10);
    if (arr.length > 1) {
      for (let i = 1; i < arr.length; i++) {
        const prevDate = arr[i - 1];
        const date = arr[i];
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
      {/* <input type="date" id="fecha" name="fecha" onChange={handleDate} /> */}
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
      <AquaButton
        onClick={() => setWaterDays([...waterDays, selectedDate])}
        disabled={!selectedDate}
      >
        Wardar
      </AquaButton>
      <div>
        <p>Últimas 10 caídas:</p>
        <ul>
          {waterDays.slice(-10).map((date) => (
            <li key={date}>
              {date.format('dddd, LL')}{' '}
              <span onClick={() => deleteDay(date)}>[Borrar]</span>
            </li>
          ))}
        </ul>
      </div>
      <p>Próxima predicción:</p>
      <pre>{JSON.stringify(waterDays.slice(-1), null, 2)}</pre>
      {moment(waterDays.slice(-1)[0])
        .add(getAverageDifference(waterDays), 'days')
        .format('dddd, LL')}
      <p>
        En {getAverageDifference(waterDays)} día
        {getAverageDifference(waterDays) > 1 ? 's' : ''}
      </p>
    </div>
  );
}

export default Agua;
