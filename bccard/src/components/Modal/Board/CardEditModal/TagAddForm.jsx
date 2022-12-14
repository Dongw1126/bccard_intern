import React, { useEffect, useState, useRef } from "react";
import CustomTag from "../../../Board/components/CustomTag";
import { v4 as uuidv4 } from "uuid";

import { ButtonGroup, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import styles from "./TagAddForm.module.css";
import * as Constants from "../../../../constants";

const defaultColor = {
  color: "white",
  bgColor: "#000000",
};

const iconSx = {
  width: 20,
  height: 20,
};

function TagAddForm(props) {
  const { newTags, setNewTags } = props;
  const [adding, setAdding] = useState(false);
  const [tagColor, setTagColor] = useState(defaultColor);
  const inputRef = useRef(null);

  const paletteOnClick = (info) => {
    setTagColor(info);
  };

  const tagOnClick = (id) => {
    const updated = [...newTags].filter((tag) => tag.id !== id);
    setNewTags(updated);
  };

  const handleAddClick = () => {
    const updated = [
      ...newTags,
      {
        id: uuidv4(),
        title: inputRef?.current.value,
        color: tagColor.color,
        bgColor: tagColor.bgColor,
      },
    ];
    setNewTags(updated);
    setAdding(false);
  };

  const handleCancel = () => {
    setAdding(false);
    setTagColor(defaultColor);
  };

  return (
    <>
      <div className={styles.formLabel}>태그</div>
      <div className={styles.root}>
        {newTags.map((tag) => (
          <div
            onClick={() => tagOnClick(tag.id)}
            className={styles.tag}
            key={tag.id}
          >
            <CustomTag {...tag} />
          </div>
        ))}
      </div>
      {adding ? (
        <div>
          <Autocomplete
            freeSolo
            options={Constants.TAGS_COMMON}
            sx={{ width: 250 }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={inputRef}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleAddClick();
                }}
                size="small"
                autoFocus
              />
            )}
          />

          <div className={styles.colorPicker}>
            {Constants.TAG_COLORS.map((info) => (
              <div
                key={info.bgColor}
                className={`${styles.palette} ${
                  info.bgColor === tagColor.bgColor && styles.selected
                }`}
                style={{
                  backgroundColor: info.bgColor,
                  color: info.color,
                }}
                onClick={() => paletteOnClick(info)}
              />
            ))}
          </div>
          <div>
            <ButtonGroup sx={{ my: 0.5 }}>
              <Button onClick={handleAddClick}>추가</Button>
              <Button onClick={handleCancel}>취소</Button>
            </ButtonGroup>
          </div>
        </div>
      ) : (
        <IconButton onClick={() => setAdding(true)} sx={{ ...iconSx, mt: 1 }}>
          <AddIcon sx={iconSx} />
        </IconButton>
      )}
    </>
  );
}

export default TagAddForm;
