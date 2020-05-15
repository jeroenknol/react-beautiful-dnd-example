import React from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import '@atlaskit/css-reset';
import initialData from './initial-data';
import Column from './column';

const Container = styled.div`
  display: flex;
`;

function delay(fn, time = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, time);
  });
}

function useMyCoolSensor(api) {
  const startDrag = React.useCallback(
    async function start() {
      const preDrag = api.tryGetLock('column-1');
      if (!preDrag) {
        return;
      }

      const drag = preDrag.snapLift();
      await delay(drag.moveRight, 0);
      await delay(drag.drop);
    },
    [api]
  );

  React.useEffect(() => {
    const button = document.getElementById('startDrag');
    button.addEventListener('click', startDrag);

    return () => {
      button.removeEventListener('click', startDrag);
    };
  }, [startDrag]);
}

const App = () => {
  const [state, setState] = React.useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...state,
        columnOrder: newColumnOrder,
      };

      setState(newState);
      return;
    }

    const startColumn = state.columns[source.droppableId];
    const finishColumn = state.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);
      return;
    }

    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartColumn = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishColumn = {
      ...finishColumn,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    };

    setState(newState);
    return;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} sensors={[useMyCoolSensor]}>
      <Droppable droppableId='all-columns' direction='horizontal' type='column'>
        {(provided) => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {state.columnOrder.map((columnId, index) => {
              const column = state.columns[columnId];
              const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
      <button id='startDrag'>Click</button>
    </DragDropContext>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
