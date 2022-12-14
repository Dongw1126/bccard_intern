import React, { useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import * as nt from "./notification";

import styles from "./NotificationAccordian.module.css";

function NotificationAccordian(props) {
  const { user, notifications, setNotifications } = props;

  const handleReadClick = (id) => {
    nt.readDBNotification(id)
      .then(() => nt.getDBNotification(user.username))
      .then((res) => setNotifications(res));
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className={styles.header}>
            <div>읽지않은 알림</div>
            <div className={styles.number}>{notifications.length}</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          {notifications.map((n) => (
            <div key={n.id} className={styles.notificationContainer}>
              <div className={styles.content}>
                <div>{nt.getYYYYMMDD(n.createdAt)}</div>
                <div>{n.content}</div>
              </div>
              <div
                className={styles.readButton}
                onClick={() => handleReadClick(n.id)}
              >
                읽음 표시
              </div>
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default NotificationAccordian;
