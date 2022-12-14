import React, { useEffect, useRef } from "react";
import { Dialog } from "@mui/material";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";
import * as Constants from "../../constants";

/**
 * 이모지 Modal 창
 */

// 한글 번역하기
function EmojiPicker(props) {
  const ref = useRef();

  useEffect(() => {
    new Picker({ ...props, data, ref, i18n });
  }, []);

  return <div ref={ref} />;
}

function EmojiPickerModal(props) {
  const { setChosenEmoji } = props;
  const onEmojiSelect = (emoji) => {
    setChosenEmoji(emoji.native);
    props.onClose();
  };
  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <EmojiPicker onEmojiSelect={onEmojiSelect} />
    </Dialog>
  );
}

export default EmojiPickerModal;

const i18n = {
  search: "검색 (영어로)",
  search_no_results_1: "Oh no!",
  search_no_results_2: "이모지를 찾을 수 없습니다.",
  pick: "이모지를 고르세요",
  add_custom: "Add custom emoji",
  categories: {
    activity: "Activity",
    custom: "Custom",
    flags: "Flags",
    foods: "Food & Drink",
    frequent: "자주 사용되는 이모지",
    nature: "Animals & Nature",
    objects: "Objects",
    people: "Smileys & People",
    places: "Travel & Places",
    search: "Search Results",
    symbols: "Symbols",
  },
  skins: {
    choose: "Choose default skin tone",
    1: "Default",
    2: "Light",
    3: "Medium-Light",
    4: "Medium",
    5: "Medium-Dark",
    6: "Dark",
  },
};
