import React, { useRef } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

function NewCardForm(props) {
  const titleRef = useRef(null);
  const descRef = useRef(null);

  const { onCancel, onAdd } = props;
  const handleAdd = () => {
    onAdd({
      title: titleRef.current.value,
      description: descRef.current.value,
      tags: [],
      cardStyle: {
        width: 260,
        maxWidth: 260,
        backgroundColor: "white",
        margin: "auto",
        marginBottom: 9,
      },
    });
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 3,
        border: "1px solid #eee",
        borderBottom: "1px solid #ccc",
      }}
    >
      <div style={{ padding: 5, margin: 5 }}>
        <div>
          <div style={{ marginBottom: 12 }}>
            <TextField
              fullWidth
              inputRef={titleRef}
              label="타이틀"
              size="small"
              variant="outlined"
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <TextField
              fullWidth
              multiline
              inputRef={descRef}
              label="내용"
              size="small"
              variant="outlined"
            />
          </div>
        </div>

        <ButtonGroup size="small" fullWidth variant="contained">
          <Button onClick={handleAdd}>추가</Button>
          <Button onClick={onCancel}>취소</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default NewCardForm;

/*
  return (
    <div
      style={{
        background: "white",
        borderRadius: 3,
        border: "1px solid #eee",
        borderBottom: "1px solid #ccc",
      }}
    >
      <div style={{ padding: 5, margin: 5 }}>
        <div>
          <div style={{ marginBottom: 5 }}>
            <input type="text" ref={titleRef} placeholder="Title" />
          </div>
          <div style={{ marginBottom: 5 }}>
            <input type="text" ref={descRef} placeholder="Description" />
          </div>
        </div>
        <button onClick={handleAdd}>Add</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
*/
