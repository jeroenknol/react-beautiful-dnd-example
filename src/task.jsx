import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 150ms ease;
  background-color: ${(props) =>
    props.isDragDisabled
      ? 'lightgrey'
      : props.isDragging
      ? 'lightblue'
      : 'white'};

  display: flex;
  align-items: center;
`;

const Handle = styled.div`
  height: 20px;
  width: 20px;
  background-color: ${(props) => {
    switch (props.parentColumn) {
      case 'column-1':
        return 'indianred';
      case 'column-2':
        return 'orange';
      case 'column-3':
        return 'lightgreen';
      default:
        return 'lightgrey';
    }
  }};
  border-radius: 4px;
  margin-right: 8px;
  opacity: ${(props) => (props.isDragDisabled ? 0.6 : 1)};
`;

const Content = styled.p`
  flex: 1;
  margin: 0;
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
  const [isDragDisabled, setIsDragDisabled] = React.useState(
    props.isDragDisabled
  );

  React.useEffect(() => {
    setIsDragDisabled(props.isDragDisabled);
  }, [props.isDragDisabled]);

  return (
    <Draggable
      draggableId={props.task.id}
      index={props.index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          isDragDisabled={isDragDisabled}
        >
          <Handle
            {...provided.dragHandleProps}
            parentColumn={props.parentColumn}
            isDragDisabled={isDragDisabled}
          />
          <Content>{props.task.content}</Content>
          <Lock
            onClick={() => setIsDragDisabled(!isDragDisabled)}
            isLocked={isDragDisabled}
          />
        </Container>
      )}
    </Draggable>
  );
};
