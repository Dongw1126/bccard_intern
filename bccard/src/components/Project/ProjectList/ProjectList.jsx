import React from "react";
import ProjectCard from "../ProjectCard";
import styles from "./ProjectList.module.css";

function ProjectList(props) {
  const { projects, setRefresh } = props;

  return (
    <div className={styles.projectContainer}>
      {projects.map((p) => {
        return (
          <div className={styles.project} key={p.id}>
            <ProjectCard data={p} setRefresh={setRefresh} />
          </div>
        );
      })}
    </div>
  );
}

export default ProjectList;
