import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import LinkIcon from "@mui/icons-material/Link";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";

function CopyLinkButton(props) {
  // const { sx } = props;
  const [open, setOpen] = useState(false);
  const handleOnClick = (e) => {
    setOpen(true);
    setTimeout(() => setOpen(false), 700);
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <Tooltip
      title={<Typography fontSize={15}>링크 복사됨</Typography>}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      open={open}
    >
      <IconButton onClick={handleOnClick}>
        <LinkIcon />
      </IconButton>
    </Tooltip>
  );
}

export default CopyLinkButton;
