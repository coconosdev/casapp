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

function Pendientes() {
  const [pendientesList, setPendientesList] = useState();
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

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    let items = reorder(
      pendientesList,
      result.source.index,
      result.destination.index
    );

    items = items.map((elem, i) => {
      return { ...elem, order: i };
    });

    items.forEach(({ id, name, order }) =>
      FirestoreService.updatePendientes(id, name, order)
    );

    setPendientesList(items);
  };

  const addPendientes = (name) => {
    setLocalPendientes('');
    FirestoreService.addPendientes(name, pendientesList.length)
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

  const orderPendientes = (a, b) => {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  };

  const saveEdit = (e, id, _name, order) => {
    let name = e.target.value;

    FirestoreService.updatePendientes(id, name, order)
      .then(() => {
        // const updatePendientes = [...pendientesList];
        // updatePendientes = updatePendientes.map((item) => {
        //   if (id === item.id) {
        //   }
        // });
      })
      .catch((e) => console.log('error masivo handle edit', e));
  };

  const handleEdit = (e, id) => {
    const updatedPendientes = pendientesList.map((elem) => {
      if (elem.id === id) {
        return {
          ...elem,
          name: e.target.value,
        };
      }
      return elem;
    });
    setPendientesList(updatedPendientes);
  };

  const handleKey = (e) => {
    if (e.charCode === 13) {
      addPendientes(localPendientes);
    }
  };

  return (
    <div className="Pendientes-component">
      {!pendientesList ? (
        <Spinner />
      ) : (
        <div>
          <Grid container className="input-wrapper">
            <Grid item xs={12} md={3}>
              <TextField
                name="name"
                value={localPendientes}
                onChange={handleChange}
                nKeyPress={handleKey}
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
          <div className="mt-15">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(
                      snapshot.isDraggingOver,
                      pendientesList.length
                    )}
                  >
                    {pendientesList.sort(orderPendientes).map((item, index) => (
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
                              name="name"
                              value={item.name}
                              className="input-text"
                              onChange={(e) => handleEdit(e, item.id)}
                              onBlur={(e) =>
                                saveEdit(e, item.id, item.name, item.order)
                              }
                            />
                            <Checkbox
                              checked={false}
                              color="primary"
                              onChange={() => deletePendientes(item.id)}
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

export default Pendientes;
