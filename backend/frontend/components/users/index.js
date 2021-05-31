import { useState, useEffect } from "react";
import common from "../../helper/api";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "reactstrap";
import { useFormik } from "formik";
import swal from "sweetalert";
import Link from "next/link";
import Switch from "react-switch";
import ToggleButton from "react-toggle-button";
import axios from "axios";
import Navbar from "../navbar";

import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

// define variable for add users
const initialValues = {
  name: "",
  email: "",
  role: "",
  mobileNo: "",
};

// validate all the value to add user
const validate = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = " name is required";
  }
  if (!values.email) {
    errors.email = "email is required";
  } else if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      values.email
    )
  ) {
    errors.email = "please provide a valid email";
  }
  if (!values.mobileNo) {
    errors.mobileNo = "mobile number is required";
  }
  if (!values.role) {
    errors.role = "role is required";
  }
  return errors;
};

const UserListing = ({props}) => {
  const router = useRouter();
  const [Token, setToken] = useCookies(["jwt"]);
  const [UserListing, setUsers] = useState([]);
  const [role, setRole] = useState([]);
  const [search, setSearch] = useState("");
  //user add model
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // using formik form for submit ,validate
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      var data = JSON.stringify(values);
    
      var config = {
        method: "post",
        url: `${common.api_url}user`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          setModal(false);
          swal("Good job!", "user Added Successfully", "success");
          getData();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validate,
  });

  // render when the component open
  useEffect(() => {
    if (Token && Token.jwt) {
      getData();
      getRoles();
      return (
        <> </>
      );
    } else {
      return router.push("/login ");
    }
  }, []);

  // get roles of users for dropdown
  const getRoles = () => {
    var config = {
      method: "get",
      url: `${common.api_url}roles`,
    };

    axios(config)
      .then(function (response) {
        setRole(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // get all user data to show on listing
  const getData = async () => {
    let res = await fetch(`${common.api_url}users`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "x-requested-with, x-requested-by",
      },
    });
    let data = await res.json();
    setUsers(data);
  };

  // update the role of user
  const changeRole = (e) => {
    var data = JSON.stringify(e);
    var config = {
      method: "put",
      url: `${common.api_url}user`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        swal(response.data.message);
        getData();
      },
      (error) => {
        swal(error.response.data.message);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // user enable or disable for login
  const handleChange = (data) => {
    var data = JSON.stringify(data);
    var config = {
      method: "put",
      url: `${common.api_url}updateStatus`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        swal(response.data.message);
        getData();
      },
      (error) => {
        swal(error.response.data.message);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // show listing of user in table
  var userData = UserListing.filter((val) => {
    if (search == "") {
      return val;
    } else if (val.role == search) {
      return val;
    }
  }).map((ele, key) => {
    return (
      <tr key={key}>
        <td>{ele.name}</td>
        <td>{ele.email} </td>
        <td>
          {" "}
          <select
            value={ele.role}
            onChange={(e) => changeRole({ role: e.target.value, _id: ele._id })}
            className="form-control"
          >
            {role.map((ele, key) => (
              <option value={ele._id} key={key}>
                {ele.title}
              </option>
            ))}
          </select>
        </td>
        {ele.isEnabled == true ? (
          <td>
            <span className="badge my-badge text-success badge-success">
              enabled
            </span>
            &nbsp;
            <Switch
              checked={ele.isEnabled}
              onChange={(e) => handleChange({ isEnabled: false, _id: ele._id })}
            />{" "}
          </td>
        ) : (
          <td>
            <span className="badge my-badge text-danger  badge-danger">
              disabled
            </span>{" "}
            <Switch
              checked={ele.isEnabled}
              onChange={(e) => handleChange({ isEnabled: true, _id: ele._id })}
            />
          </td>
        )}
        {/* <td>{ele.createdAt}</td>
         */}

        <td>
          <Link href={`/user/${ele._id}`}>
            <button className="btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-eye-fill"
                viewBox="0 0 16 16"
              >
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
              </svg>{" "}
            </button>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <>
    <Navbar/>
      <div className="container mt-5">
        <h1 className="text-secondary">User Management</h1>
        <div className="row">
          <div className="col-md-6">
            <Button color="danger" onClick={toggle}>
              Add User
            </Button>
          </div>
          <div className="col-md-6">
            <select
              className="form-control"
              onChange={(e) => setSearch(e.target.value)}
            >
              <option value={""}>Search by role</option>
              {role.map((ele, key) => (
                <option value={ele._id} key={key}>
                  {ele.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mt-4">
          <div className="span5">
            <table className="table table-striped table-condensed">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  {/* <th>Date registered</th>         */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{userData}</tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <Modal isOpen={modal} toggle={toggle} className="add-user-modal">
          <ModalHeader toggle={toggle}>Add New User</ModalHeader>
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  className="form-control"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <span className="text-danger">{formik.errors.name}</span>
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="form-control"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <span className="text-danger">{formik.errors.email}</span>
              </div>
              <div>
                <label htmlFor="mobileNo">Contact No</label>
                <input
                  id="mobileNo"
                  className="form-control"
                  name="mobileNo"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.mobileNo}
                />
                <span className="text-danger">{formik.errors.mobileNo}</span>
              </div>
              <div>
                <label htmlFor="role">Role</label>
                <select
                  className="form-control"
                  name="role"
                  id="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                >
                  <option>select a value</option>
                  {role.map((ele, key) => (
                    <option value={ele._id} key={key}>
                      {ele.title}
                    </option>
                  ))}
                </select>
                <span className="text-danger">{formik.errors.role}</span>
              </div>
              <Button type="submit" className="btn btn-primary mt-5">
                Submit
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button color="danger" className=" mt-5" onClick={toggle}>
                Cancel
              </Button>
            </form>
          </ModalBody>
        </Modal>

        {/* view data  */}
      </div>
    </>
  );
};

export default UserListing;
