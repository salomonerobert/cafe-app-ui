import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Grid,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectionActions } from "../store";
import axios from "axios";
import { employeeUUIDService } from "../utils/employee_uuid.service";

const baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

const EmployeeAddEdit = (props) => {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const employee = useSelector((state) => state.editEmployee);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    if (employee) {
      setValue("name", employee.name);
      setValue("email_address", employee.email_address);
      setValue("phone_number", employee.phone_number);
      setValue("gender", employee.gender);
      setValue("cafe", getCafeName(employee));
    }

    fetchCafes();
  }, [employee, setValue]);

  function fetchCafes() {
    axios.get(`${baseURL}/cafes`).then((res) => setCafes(res.data));
  }

  function getCafeName(employee) {
    return cafes.filter((cafe) => cafe._id === employee.cafe)[0]?.name;
  }

  const onSubmit = async (data) => {
    if (employee) {
      const dataWithIdAndStartDate = {
        employee_id: employee.employee_id,
        start_date: employee.start_date,
        ...data,
      };

      axios
        .put(`${baseURL}/employees`, {
          employee: dataWithIdAndStartDate,
        })
        .then((res) => {
          if (res.status === 200) {
            window.alert("Successfully updated employee details");
          } else {
            window.alert(
              "There was an issue updating employee details. Please try again later."
            );
          }
        });
    } else {
      let uuid = await employeeUUIDService.getUUID(); //simplified UUID service to generate ID
      const dataWithIdAndStartDate = {
        employee_id: uuid,
        start_date: new Date(),
        ...data,
      };
      axios
        .post(`${baseURL}/employees`, {
          employee: dataWithIdAndStartDate,
        })
        .then((res) => {
          if (res.status === 201) {
            window.alert("Successfully added new employee");
          } else {
            window.alert(
              "There was an issue adding employee details. Please try again later."
            );
          }
        });
    }

    dispatch(selectionActions.setEditEmployee(null));
    navigate("/employees");
  };

  const handleCancel = () => {
    navigate("/employees");
    dispatch(selectionActions.setEditEmployee(null));
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
              name="email_address"
              control={control}
              rules={{
                required: true,
                maxLength: 256,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email format.",
                },
              }}
              render={({ field }) => (
                <TextField
                  label="Email"
                  fullWidth
                  {...field}
                  error={!!errors.email}
                  helperText={errors.email && errors.email.message}
                  style={{ marginBottom: "16px" }}
                />
              )}
            />
            <Controller
              name="phone_number"
              control={control}
              rules={{
                required: true,
                maxLength: 8,
                minLength: 8,
                pattern: {
                  value: /^[89][0-9]{7}$/,
                  message: "Invalid phone number format.",
                },
              }}
              render={({ field }) => (
                <TextField
                  label="Phone Number"
                  fullWidth
                  {...field}
                  error={!!errors.phone_number}
                  helperText={
                    errors.phone_number && errors.phone_number.message
                  }
                  style={{ marginBottom: "16px" }}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue={employee?.gender}
              name="gender"
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
              )}
            />
            <Controller
              name="cafe"
              control={control}
              defaultValue={employee?.cafe}
              render={({ field }) => (
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="assigned-cafe-label">Cafe</InputLabel>
                  <Select
                    {...field}
                    labelId="assigned-cafe-label"
                    id="assigned-cafe"
                    label="Cafe"
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {cafes.map((cafe, index) => (
                      <MenuItem key={index} value={cafe._id}>
                        {cafe.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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

export default EmployeeAddEdit;
