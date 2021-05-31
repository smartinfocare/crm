import { useFormik } from "formik";
import { useRouter } from "next/router";
import swal from "sweetalert";
import Link from "next/link";
import axios from "axios";
import Cookie from "js-cookie";
import Navbar from "../../components/navbar";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
//define variable for login input
const initialValues = {
  email: "",
  password: "",
};

// validate value of email and password
const validate = (values) => {
  let errors = {};
  if (!values.email) {
    errors.email = "email is required";
  } else if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      values.email
    )
  ) {
    errors.email = "please provide a valid email";
  }
  if (!values.password) {
    errors.password = "password is required";
  }
  return errors;
};

const Login = () => {
  const [Token, setToken] = useCookies(["jwt"]);
  console.log(Token.jwt);
  //set router to redirect the user to dashboard
  const router = useRouter();


useEffect(() => {
  if (Token && Token.jwt) {
    
      return router.push("/dashboard ");

  } else {
   return <></> 
  }
}, []);



  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      console.log(values);
      var data = JSON.stringify(values);
      var config = {
        method: "post",
        url: "http://localhost:8080/api/loginWithPassword",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(
          function (response) {
            swal(response.data.message);
            localStorage.setItem("key", response.data.Token);
            Cookie.set("jwt", response.data.Token);
            router.push("dashboard");
          },
          (error) => {
            swal(error.response.data.message);
          }
        )
        .catch(function (error) {
          console.log(error);
        });
    },
    validate,
  });
  return (
    <>
    <Navbar/>
      <div className="container my-container1 mt-5">
        <div className="fadeIn first">
          <h1 className="h1 text-center mt-4">Login</h1>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6">
              {" "}
              <input
                type="text"
                id="login"
                className=" mt-4 form-control"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="please enter your email"
              />
              <span className="my-span text-danger mt-2">
                {formik.errors.email}{" "}
              </span>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <input
                type="text"
                id="password"
                className=" form-control"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="enter your password"
              />
              <span className="text-danger my-span">
                {formik.errors.password}{" "}
              </span>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <input
                type="submit"
                className="form-control btn btn-primary"
                value="Log In"
              />
            </div>
          </div>
        </form>
        {/* <div id="formFooter">
        <a className="underlineHover" href="#">Forgot Password?</a>
      </div> */}
      </div>
    </>
  );
};

export default Login;
