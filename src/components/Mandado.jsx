import React, { useState, useEffect } from 'react';
import * as FirestoreService from '../services/firestore';
import Spinner from './Spinner';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: `10px 15px`,
  margin: `0 0 ${grid}px 0`,
  border: '1px solid #eaeaea',
  borderRadius: '5px',
  background: isDragging ? '#eaeaea' : 'transparent',
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver, elems) => {
  return {
    borderRadius: '5px',
    background: isDraggingOver ? 'lightblue' : 'transparent',
    padding: grid,
    width: '100%',
    height: `${elems * 72 + grid}px`,
  };
};

function Mandado() {
  const [todoList, setTodoList] = useState();
  const [localTodo, setLocalTodo] = useState('');

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    let items = reorder(
      todoList,
      result.source.index,
      result.destination.index
    );

    items = items.map((elem, i) => {
      return { ...elem, order: i };
    });

    items.forEach(({ id, nombre, order }) =>
      FirestoreService.updateTodo(id, nombre, order)
    );

    setTodoList(items);
  };

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
    FirestoreService.addTodo(nombre, todoList.length)
      .then(() => {})
      .catch((e) => console.log('error masivo create', e));
  };

  const deleteTodo = (id) => {
    FirestoreService.deleteTodo(id)
      .then(() => {})
      .catch((e) => console.log('error masivo delete', e));
  };

  const handleChange = (e) => {
    setLocalTodo(e.target.value);
  };

  const orderTodos = (a, b) => {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  };

  const saveEdit = (e, id, _nombre, order) => {
    let nombre = e.target.value;
    FirestoreService.updateTodo(id, nombre, order)
      .then(() => {})
      .catch((e) => console.log('error masivo handle edit', e));
  };

  const handleEdit = (e, id) => {
    const updatedTodos = todoList.map((elem) => {
      if (elem.id === id) {
        return {
          ...elem,
          nombre: e.target.value,
        };
      }
      return elem;
    });
    setTodoList(updatedTodos);
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
          <div className="mt-15">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(
                      snapshot.isDraggingOver,
                      todoList.length
                    )}
                  >
                    {todoList.sort(orderTodos).map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            splay="flex"
                            flexDirection="row"
                            flexWrap="nowrap"
                            justifyContent="flex-start"
                            alignItems="center"
                            key={item.key}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <TextField
                              name="nombre"
                              value={item.nombre}
                              className="input-text"
                              onChange={(e) => handleEdit(e, item.id)}
                              onBlur={(e) =>
                                saveEdit(e, item.id, item.nombre, item.order)
                              }
                            />
                            <Checkbox
                              checked={false}
                              color="primary"
                              onChange={() => deleteTodo(item.id)}
                            />
                            <DragIndicatorIcon />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mandado;
