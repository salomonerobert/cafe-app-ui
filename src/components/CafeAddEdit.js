import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  FormControl,
  FormHelperText,
  Container,
  Grid,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectionActions } from "../store";
import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

const CafeAddEdit = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const cafe = useSelector((state) => state.editCafe);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (cafe) {
      setValue("name", cafe.name);
      setValue("description", cafe.description);
      setValue("location", cafe.location);
    }
  }, [cafe, setValue]);

  function uploadImageAndGetUrl(fileList) {
    //typically we would updlood the image to CDN service and set the logo as the url, but simulating that using a static url in this case to limited scope
    return "https://avatars.githubusercontent.com/u/85680102"
  }

  const onSubmit = (data) => {
    const logoUrl = uploadImageAndGetUrl(data.logo)
    if (cafe) {
        const dataWithLogoAndId = {
            _id: cafe._id,
            ...data,
            logo: logoUrl, 
        }

        axios.put(`${baseURL}/cafes`, {
            cafe: dataWithLogoAndId
        }).then((res) => {
            if (res.status === 200) {
                window.alert('Successfully updated cafe details')
            } else {
                window.alert('There was an issue updating cafe details. Please try again later.')
            }
        })
    } else {
        const dataWithLogoUrl = {
            ...data,
            logo: logoUrl
        }
        axios.post(`${baseURL}/cafes`, {
            cafe: dataWithLogoUrl
        }).then((res) => {
            if (res.status === 201) {
                window.alert('Successfully added new cafe')
            } else {
                window.alert('There was an issue adding cafe details. Please try again later.')
            }
        })
    }
    dispatch(selectionActions.setEditCafe(null))
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
    dispatch(selectionActions.setEditCafe(null));
  };

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "16px" }}>
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12} sm={6} style={{ width: "100%" }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true, minLength: 6, maxLength: 10 }}
              render={({ field }) => (
                <TextField
                  label="Name"
                  fullWidth
                  {...field}
                  error={!!errors.name}
                  helperText={
                    errors.name && "Name must be between 6 and 10 characters."
                  }
                  style={{ marginBottom: "16px" }}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              rules={{ required: true, maxLength: 256 }}
              render={({ field }) => (
                <TextField
                  label="Description"
                  fullWidth
                  {...field}
                  error={!!errors.description}
                  helperText={
                    errors.description &&
                    "Description must be under 256 characters."
                  }
                  style={{ marginBottom: "16px" }}
                />
              )}
            />
            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <input
                type="file"
                {...register("logo", {
                  required: "Please upload a file",
                  validate: (files) =>
                  (files[0]?.size < 2000000 ||
                  "File size must be less than 2MB"),
                })}
              />
              {errors.logo && (
                <FormHelperText error>{errors.logo.message}</FormHelperText>
              )}
            </FormControl>
            <Controller
              name="location"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  label="Location"
                  fullWidth
                  {...field}
                  error={!!errors.location}
                  style={{ marginBottom: "16px" }}
                />
              )}
            />
            <Button type="submit" style={{ marginRight: "8px" }}>
              Submit
            </Button>
            <Button type="button" onClick={() => handleCancel()}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CafeAddEdit;
