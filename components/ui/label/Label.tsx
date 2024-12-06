import React from "react";
import { CiCircleInfo, CiWarning, CiCircleCheck } from "react-icons/ci";
import styles from "./Label.module.css";
type typeLabel = "error" | "success" | "warning" | "info";
interface ILabelProps {
  text: string;
  type: typeLabel;
}

const Label = ({ text, type }: ILabelProps) => {
  return (
    <div
      className={`
        ${type === "success" && styles.sucess} 
        ${type === "error" && styles.error} 
        ${type === "warning" && styles.warning} 
        ${type === "info" && styles.info} 
        ${styles.label}
        flex justify-center items-center gap-3 rounded p-2 w-full m-2
        `}
    >
      {type === "success" && <CiCircleCheck />}
      {type === "error" && <CiCircleInfo />}
      {type === "warning" && <CiWarning />}
      {type === "info" && <CiCircleInfo />}
      {text}
    </div>
  );
};

export default Label;
