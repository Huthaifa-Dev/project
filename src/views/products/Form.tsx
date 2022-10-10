import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Modal from "../../components/utils/Modal/Modal";
import { AppDispatch } from "../../redux";
import {
  addCategoryData,
  editCategory,
  editCategoryData,
} from "../../redux/slices/categorySlice";
import { Category } from "../../types";
import "./Form.scss";
const Form: React.FC<{ onClose: () => void; ID?: string }> = ({
  onClose,
  ID,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const submitHandler = (data: { name: string }) => {
    if (ID) {
      toast.promise(
        dispatch(editCategoryData({ id: ID, newName: data.name })),
        {
          loading: "Editing...",
          success: "Edited",
          error: "Error",
        }
      );
      onClose();
    } else {
      toast.promise(dispatch(addCategoryData(data)), {
        loading: "Adding Category...",
        success: <b>Category Added Successfully</b>,
        error: <b>Could not Add Category.</b>,
      });
      onClose();
    }
  };
  return (
    <Modal
      title="Add Category"
      onClose={onClose}
      onSubmit={handleSubmit((data) => {
        submitHandler(data);
      })}
    >
      <form
        onSubmit={handleSubmit((data) => {
          submitHandler(data);
        })}
      >
        <div className="form-group">
          <label htmlFor="name">Category Name:</label>
          <div className="form-group-wrapper">
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
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default Form;
