import React, { useState, useEffect } from 'react';
import * as FirestoreService from '../services/firestore';
import Spinner from './Spinner';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

function Pendientes() {
  const [PendientesList, setPendientesList] = useState();
  const [localPendientes, setLocalPendientes] = useState('');

  useEffect(() => {
    const unsubscribe = FirestoreService.streamPendientesList({
      next: (querySnapshot) => {
        const updatedPendientess = querySnapshot.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return { id, ...data };
        });
        setPendientesList(updatedPendientess);
      },
      error: () => {
        console.log('error observer');
      },
    });
    return unsubscribe;
  }, [setPendientesList]);
  const addPendientes = (name) => {
    setLocalPendientes('');
    FirestoreService.addPendientes(name)
      .then(() => {})
      .catch((e) => console.log('error masivo create', e));
  };
  const deletePendientes = (id) => {
    FirestoreService.deletePendientes(id)
      .then(() => {})
      .catch((e) => console.log('error masivo delete', e));
  };
  const handleChange = (e) => {
    //const changes = { name:  };
    setLocalPendientes(e.target.value);
  };
  const handleEdit = (e, id, _name) => {
    let name = e.target.value;

    FirestoreService.updatePendientes(id, name)
      .then(() => {
        // const updatePendientes = [...PendientesList];
        // updatePendientes = updatePendientes.map((item) => {
        //   if (id === item.id) {
        //   }
        // });
      })
      .catch((e) => console.log('error masivo handle edit', e));
  };
  return (
    <div className="Pendientes-component">
      {!PendientesList ? (
        <Spinner />
      ) : (
        <div>
          <Grid container className="input-wrapper">
            <Grid item xs={12} md={3}>
              <TextField
                name="name"
                value={localPendientes}
                onChange={handleChange}
                label="Pendiente"
                variant="outlined"
                size="small"
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="primary"
                disabled={localPendientes === ''}
                fullWidth={true}
                onClick={() => addPendientes(localPendientes)}
              >
                Agregar +
              </Button>
            </Grid>
          </Grid>
          <div>
            <p>Lista de Pendientes:</p>

            {PendientesList.map((ele, index) => (
              <Box
                display="flex"
                flexDirection="row"
                flexWrap="nowrap"
                justifyContent="flex-start"
                alignItems="center"
                key={ele.key}
              >
                <TextField
                  name="name"
                  value={ele.name}
                  onChange={(e) => handleEdit(e, ele.id, ele.name)}
                />
                <Checkbox
                  checked={false}
                  color="primary"
                  onChange={() => deletePendientes(ele.id)}
                />
              </Box>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Pendientes;
