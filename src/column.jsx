import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './task';

const Container = styled.div`
  flex: 1 1 0px;
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.isDropDisabled ? 'lightgrey' : 'white'};
`;

const Title = styled.h3`
  padding: 8px;
`;

const TaskList = styled.div`
  padding: 8px;
  background-color: ${(props) => (props.isDraggingOver ? 'lightgrey' : '')};
  transition: background-color 150ms ease;
  flex-grow: 1;
  min-height: 100px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  background: none;
  border: none;
  font-size: 18px;
`;

const Lock = ({ isLocked, onClick }) => (
  <Button onClick={onClick}>{isLocked ? '🔒' : '🔓'}</Button>
);

export default (props) => {
  const [isDropDisabled, setIsDropDisabled] = React.useState(false);

  return (
    <Draggable
      draggableId={props.column.id}
      index={props.index}
      isDragDisabled={isDropDisabled}
    >
      {(provided) => (
        <Container
          isDropDisabled={isDropDisabled}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <HeaderContainer>
            <Title {...provided.dragHandleProps}>{props.column.title}</Title>
            <Lock
              onClick={() => setIsDropDisabled(!isDropDisabled)}
              isLocked={isDropDisabled}
            />
          </HeaderContainer>
          <Droppable
            droppableId={props.column.id}
            isDropDisabled={isDropDisabled}
            type='task'
          >
            {(provided, snapshot) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {props.tasks.map((task, index) => (
                  <Task
                    key={task.id}
                    task={task}
                    index={index}
                    parentColumn={props.column.id}
                    isDragDisabled={isDropDisabled}
                  />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
};
