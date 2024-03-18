import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/utils/Modal/Modal";
import { AppDispatch, RootState } from "../../redux";
import {
  addCategoryData,
  deleteCategory,
  editCategoryData,
  selectCatagoryById,
  selectCategories,
} from "../../redux/slices/categorySlice";
import "./Form.scss";
const Form: React.FC<{ onClose: () => void; ID?: string; DELETE?: string }> = ({
  onClose,
  ID,
  DELETE,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  // find the category of id ID from categories array
  const category = useSelector((state: RootState) =>
    selectCatagoryById(state, ID || DELETE || ""),
  );
  const categories = useSelector(selectCategories);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: category?.name || "",
    },
  });

  const submitHandler = (data: { name: string }) => {
    if (DELETE) {
      toast.promise(dispatch(deleteCategory({ body: DELETE })).unwrap(), {
        loading: "Deleting...",
        success: <b>{category?.name} Deleted Successfully</b>,
        error: <b>Could not Delete Category.</b>,
      });
    } else if (ID) {
      toast.promise(
        dispatch(editCategoryData({ id: ID, newName: data.name })),
        {
          loading: "Editing...",
          success: "Edited",
          error: "Error",
        },
      );
    } else {
      toast.promise(dispatch(addCategoryData(data)), {
        loading: "Adding Category...",
        success: <b>Category Added Successfully</b>,
        error: <b>Could not Add Category.</b>,
      });
    }
    onClose();
  };
  return (
    <Modal
      title={`${DELETE ? "Delete" : ID ? "Edit" : "Add"} Category`}
      onClose={onClose}
      onSubmit={handleSubmit((data) => {
        submitHandler(data);
      })}
    >
      {DELETE ? (
        <p>Are you sure you want to delete {category?.name}?</p>
      ) : (
        <form
          onSubmit={handleSubmit((data) => {
            submitHandler(data);
          })}
        >
          <div className="form-group">
            <label htmlFor="name">Category Name: </label>
            <div className="form-group-wrapper">
              <input
                {...register("name", {
                  required: "Name is required",
                  validate: (data) => {
                    if (data === "") {
                      return "Name is required";
                    } else if (
                      categories.find((category) => category.name === data)
                    ) {
                      return "This category already exist";
                    }
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
      )}
    </Modal>
  );
};

export default Form;
