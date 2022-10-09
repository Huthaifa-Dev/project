import React from "react";
import { useForm } from "react-hook-form";
import Modal from "../../components/utils/Modal/Modal";
import useInput from "../../hooks/useInput";
import "./Form.scss";
const Form: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  //   const {
  //     value: enteredName,
  //     hasError: nameInputHasError,
  //     onChange: nameChangeHandler,
  //     onBlur: nameBlurHandler,
  //   } = useInput(validateName);

  //   function validateName(name: string) {
  //     return (
  //       name.length > 0 && name.substring(0, name.length - 1) === enteredName
  //     );
  //   }
  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
  };
  return (
    <Modal title="Add Category" onClose={onClose} onSubmit={() => {}}>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
        <div className="form-group">
          <label htmlFor="name">Category Name:</label>
          <input
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 4,
                message: "Name must be at least 4 characters long",
              },
              maxLength: {
                value: 20,
                message: "Name must be at most 20 characters long",
              },
            })}
            type="text"
            id="name"
            className={`form-control ${
              errors.name ? "form-control--error" : ""
            }`}
          />
        </div>
      </form>
    </Modal>
  );
};

export default Form;
