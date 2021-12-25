import React, { useState } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";
import Input from "./components/Input";

//Örnek itemlar

const item = {
  id: v4(),
  name: "1",
};

const item2 = {
  id: v4(),
  name: "2",
};
const item3 = {
  id: v4(),
  name: "3",
};
const item4 = {
  id: v4(),
  name: "4",
};
const item5 = {
  id: v4(),
  name: "5",
};

function App() {
  const [text, setText] = useState("");

  // Itemları tutacak board başlangıç
  const [state, setState] = useState({
    backlog: {
      title: "Backlog",
      items: [item, item2],
    },
    todo: {
      title: "To do",
      items: [item3],
    },
    progress: {
      title: "In progress",
      items: [item4],
    },
    done: {
      title: "Completed",
      items: [item5],
    },
  });

  // Beautiful dnd'nin taşınma işlemi için, dnd dökümentasyonunda bulunan kodlar.

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    // Taşınma işlemi başlangıç. (DND Documentation)
    const itemCopy = { ...state[source.droppableId].items[source.index] };

    setState((prev) => {
      prev = { ...prev };
      // Taşıdıgın itemin taşıdıgın yerden silinmesi.
      prev[source.droppableId].items.splice(source.index, 1);

      // İtemi taşımanın bitişi.
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });
  };
  // Yeni item eklemek için butona gerekli kod satırı. .
  const addItem = () => {
    setState((prev) => {
      return {
        ...prev,
        backlog: {
          title: "backlog",
          items: [
            {
              id: v4(),
              name: text,
            },
            ...prev.backlog.items,
          ],
        },
      };
    });

    setText("");
  };

  return (
    //Beautiful DND'nin çalışma mantığında iç içe üç adet sabit component eklememiz gerekiyor. DragDropContext(ana alan) içerisine Droppable(bırakılabilen alan)
    //Draggable(taşınabilen item) şeklindedir.
    <>
      <div className="App">
        <h1>Kanban Rast</h1>

        {/* Input componenti */}
        <Input addItem={addItem} text={text} setText={setText} />
        <div className="main-col">
          <DragDropContext onDragEnd={handleDragEnd}>
            {_.map(state, (data, key) => {
              return (
                <div key={key} className={"column"}>
                  <Droppable droppableId={key}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={"droppable-col"}
                        >
                          <h3>{data.title}</h3>

                          {data.items.map((el, index) => {
                            return (
                              // Taşınabilir Itemlar için Dnd kod satırları başlangıç
                              <Draggable
                                key={el.id}
                                index={index}
                                draggableId={el.id}
                              >
                                {(provided, snapshot) => {
                                  console.log(snapshot);
                                  return (
                                    <div
                                      className={`item ${
                                        snapshot.isDragging && "dragging"
                                      }`}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      {el.name}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {/* Item eklendiginde alanın büyümesini sağlayan DND kod satırı */}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              );
            })}
          </DragDropContext>
        </div>
      </div>
    </>
  );
}

export default App;
