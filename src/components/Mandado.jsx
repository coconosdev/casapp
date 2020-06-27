import React, { useState, useEffect } from 'react';
import * as FirestoreService from '../services/firestore';
import Spinner from './Spinner';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

function Mandado() {
  const [todoList, setTodoList] = useState();
  const [localTodo, setLocalTodo] = useState('');

  useEffect(() => {
    const unsubscribe = FirestoreService.streamTodoList({
      next: (querySnapshot) => {
        const updatedTodos = querySnapshot.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return { id, ...data };
        });
        setTodoList(updatedTodos);
      },
      error: () => {
        console.log('error observer');
      },
    });
    return unsubscribe;
  }, [setTodoList]);
  const addTodo = (nombre) => {
    setLocalTodo('');
    FirestoreService.addTodo(nombre)
      .then(() => {})
      .catch((e) => console.log('error masivo create', e));
  };
  const deleteTodo = (id) => {
    FirestoreService.deleteTodo(id)
      .then(() => {})
      .catch((e) => console.log('error masivo delete', e));
  };
  const handleChange = (e) => {
    //const changes = { nombre:  };
    setLocalTodo(e.target.value);
  };
  const handleEdit = (e, id, _nombre) => {
    let nombre = e.target.value;

    FirestoreService.updateTodo(id, nombre)
      .then(() => {
        // const updateTodo = [...todoList];
        // updateTodo = updateTodo.map((item) => {
        //   if (id === item.id) {
        //   }
        // });
      })
      .catch((e) => console.log('error masivo handle edit', e));
  };
  return (
    <div className="mandado-component">
      {!todoList ? (
        <Spinner />
      ) : (
        <div>
          <Grid container className="input-wrapper">
            <Grid item xs={12} md={3}>
              <TextField
                name="nombre"
                value={localTodo}
                onChange={handleChange}
                label="Cosa"
                variant="outlined"
                size="small"
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="primary"
                disabled={localTodo === ''}
                fullWidth={true}
                onClick={() => addTodo(localTodo)}
              >
                Agregar +
              </Button>
            </Grid>
          </Grid>
          <div>
            <p>Lista de mandado:</p>

            {todoList.map((ele, index) => (
              <Box
                display="flex"
                flexDirection="row"
                flexWrap="nowrap"
                justifyContent="flex-start"
                alignItems="center"
                key={ele.key}
              >
                <TextField
                  name="nombre"
                  value={ele.nombre}
                  onChange={(e) => handleEdit(e, ele.id, ele.nombre)}
                />
                <Checkbox
                  checked={false}
                  color="primary"
                  onChange={() => deleteTodo(ele.id)}
                />
              </Box>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Mandado;
