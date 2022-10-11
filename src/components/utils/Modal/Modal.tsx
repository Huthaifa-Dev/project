// modal tsx component
import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button/Button";
import "./Modal.scss";
interface Props {
  children: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  width?: string;
}
const Modal = ({ children, onClose, onSubmit, title, width }: Props) => {
  return createPortal(
    <>
      <div className="container" style={{ width: "100%" }}>
        <div className="modal" style={{ width: width }}>
          <header className="modal__title">
            <p>{title}</p>
            <Button backgroundColor="white" onClick={onClose}>
              ❌
            </Button>
          </header>
          <main className="modal__content">{children}</main>
          <footer className="footer">
            <Button onClick={onClose}>Cancel</Button>
            <Button primary backgroundColor="#153851" onClick={onSubmit}>
              Submit
            </Button>
          </footer>
        </div>
      </div>
    </>,
    document.body
  );
};
export default Modal;
