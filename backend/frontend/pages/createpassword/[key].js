import { useRouter } from "next/router";
import { useFormik } from "formik";
import swal from "sweetalert";
import Link from "next/link";
import axios from "axios";

//define variable for  Create password
const initialValues = {
  password: "",
  confirmPassword: "",
};

// validate the all values for Create password
const validate = (values) => {
  let errors = {};
  if (!values.password) {
    errors.password = " password is required";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "confirm password is required";
  } else if (values.password != values.confirmPassword) {
    errors.confirmPassword = "password and confirm password must be match";
  }
  return errors;
};

const CreatePassword = () => {
  const router = useRouter();
  const { key } = router.query;

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      var password = { password: values.password };
      var data = JSON.stringify(password);
      var config = {
        method: "post",
        url: `http://localhost:8080/api/setPassword/${key}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(function (response) {
          swal(response.data.message);
          router.push("/");
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validate,
  });
  return (
    <div className="main-div">
      <div className="container mt-5 my-container ">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-8">
              {" "}
              <h1 className="text-center">Create Your Password</h1>
            </div>
            <div className="col-md-2"></div>
            <div className="col-md-2"></div>
            <div className="col-md-8">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control  mt-2"
                name="password"
                id="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Password"
              />
              <span className="text-danger">{formik.errors.password}</span>
            </div>
            <div className="col-md-2"></div>
            <div className="col-md-2"></div>
            <div className="col-md-8 mt-4">
              <label htmlFor="confirmPassword ">Confirm Password</label>
              <input
                type="password"
                className="form-control mt-2"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
              />
              <span className="text-danger">
                {formik.errors.confirmPassword}
              </span>
            </div>
            <div className="col-md-2"></div>
          </div>
          <div className="row mt-5">
            <div className="col-md-2"></div>
            <div className="col-md-6">
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;
