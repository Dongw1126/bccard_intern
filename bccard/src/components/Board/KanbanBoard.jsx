import React, { useEffect, useState } from "react";
import Board, { createTranslate } from "react-trello";

import CustomCard from "./components/CustomCard";
import LaneHeader from "./components/LaneHeader";
import NewLaneSection from "./components/NewLaneSection";
import NewCardForm from "./components/NewCardForm";
import NewLaneForm from "./components/NewLaneForm";
import CardEditModal from "../Modal/Board/CardEditModal";
import CardDeleteModal from "../Modal/Board/CardDeleteModal";

import useDialog from "../../hooks/useDialog";

import * as ku from "./KanbanBoardUtils";
import "./KanbanBoard.css";
import styles from "./KanbanBoard.module.css";
import ko from "./translation.json";

// const handleDragStart = (cardId, laneId) => {
//   console.log("drag started");
//   console.log(`cardId: ${cardId}`);
//   console.log(`laneId: ${laneId}`);
// };

// const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
//   console.log("drag ended");
//   console.log(`cardId: ${cardId}`);
//   console.log(`sourceLaneId: ${sourceLaneId}`);
//   console.log(`targetLaneId: ${targetLaneId}`);
// };

function KanbanBoard(props) {
  // const initState = { boardData: { lanes: [] } };
  const { projectEditable, project, participants, boardData, setBoardData } =
    props;
  const p_map = participants.reduce((acc, value) => {
    return { ...acc, [value.userId]: value };
  }, {});
  // const [boardData, setBoardData] = useState({ lanes: [] });
  const [eventBus, setEventBus] = useState(undefined);
  const [editProps, setEditProps] = useState(undefined);

  const [editOpen, handleEditOpen, handleEditClose] = useDialog();
  const [alertOpen, handleAlertOpen, handleAlertClose] = useDialog();

  // useEffect(() => {
  //   console.log("boardData changed: ", boardData);
  //   if (project && project.length > 0 && project[0].kanban) {
  //     setBoardData(JSON.parse(project[0].kanban));
  //   }
  //   setBoardData(data);
  // }, [boardData]);

  // // 데이터 변경 시 DB 업데이트
  // // 디바운싱 적용
  // useEffect(() => {
  //   const debounce = setTimeout(() => {
  //     // return await saveKanban(boardData);
  //     setDataChanged((prev) => prev + 1);
  //   }, 500);
  //   return () => {
  //     clearTimeout(debounce);
  //   };
  // }, [boardData]);

  // useEffect(() => {
  //   saveKanban(boardData);
  // }, [dataChanged]);

  // 카드 렌더링
  const _renderCard = (props) => {
    return <CustomCard {...props} p_map={p_map} />;
  };

  const _renderLaneHeader = (props) => {
    return <LaneHeader {...props} editable={projectEditable} />;
  };

  // 데이터 변경 이벤트
  const shouldReceiveNewData = (nextData) => {
    console.log("Data changed");
    // console.log(nextData);
    setBoardData(nextData);
  };

  // 카드 클릭 시 이벤트
  const handleCardClick = (cardId, metadata, laneId) => {
    const currentCard = ku.getCardById(laneId, cardId, boardData);

    setEditProps({
      laneId: laneId,
      card: currentCard,
      participants: participants,
      eventBus: eventBus,
    });

    handleEditOpen();
  };

  // 카드 삭제 버튼 클릭 시 이벤트
  const handleBeforeCardDelete = (onDelete) => {
    setEditProps((prev) => {
      return {
        ...prev,
        callback: onDelete,
      };
    });
    handleAlertOpen();
  };

  return (
    <>
      <div className={styles.root}>
        <div className={styles.intro}>
          <Board
            editable={projectEditable}
            draggable={projectEditable}
            cardDraggable={projectEditable}
            canAddLanes={projectEditable}
            data={boardData}
            onDataChange={shouldReceiveNewData}
            eventBusHandle={setEventBus}
            onCardClick={projectEditable ? handleCardClick : () => {}}
            onBeforeCardDelete={handleBeforeCardDelete}
            components={{
              Card: _renderCard,
              LaneHeader: _renderLaneHeader,
              NewCardForm: NewCardForm,
              NewLaneForm: NewLaneForm,
              NewLaneSection: NewLaneSection,
            }}
            t={createTranslate(ko)}
          />
        </div>
      </div>
      {projectEditable && (
        <>
          <CardEditModal
            project={project}
            editProps={editProps}
            open={editOpen}
            onClose={handleEditClose}
          />
          <CardDeleteModal
            editProps={editProps}
            open={alertOpen}
            onClose={handleAlertClose}
          />
        </>
      )}
    </>
  );
}

export default KanbanBoard;
