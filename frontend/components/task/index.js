import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import common from "../../helper/api";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import axios from "axios";
import swal from "sweetalert";
import {Button,Modal,ModalHeader,ModalBody,ModalFooter,Alert,} from "reactstrap";

// define variable for add TASK
const initialValues = {
  taskName: "",
  dueDate: "",
  time: "",
  assignTo: "",
  details: "",
};

// validate all the value to add TASK
const validate = (values) => {
  let errors = {};
  if (!values.taskName) {
    errors.taskName = " Task Name is required";
  }
  if (!values.dueDate) {
    errors.dueDate = "email is required";
  }
  if (!values.time) {
    errors.time = " time is required";
  }
  if (!values.assignTo) {
    errors.assignTo = " Assign To user is required";
  }
  if (!values.details) {
    errors.details = " details is required";
  }

  return errors;
};

const Task = (props) => {
  const [task, setTask] = useState([]);
  const [Token, setToken] = useCookies(["jwt"]);
  const [users, setUsers] = useState([]);
  const [document, setDocument] = useState("");
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [id, setId] = useState(props.lead);

  useEffect(() => {
    getData();
  }, []);
  //   get users api call
  const getUsers = async () => {
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

  // using formik form for submit ,validate
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      console.log(values);
      onSubmit(values);
    },
    validate,
  });
  //   show create task form
  const openAddModel = () => {
    setModal(true);
    getUsers();
  };
  const getData = async () => {
    let res = await fetch(`${common.api_url}getTasksByLeadId/${id}`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "x-requested-with, x-requested-by",
        Authorization: `Bearer ${Token.jwt}`,
      },
    });
    let data = await res.json();
    setTask(data.data);
  };
  //   submit the form using formik for create the task
  const onSubmit = (values) => {
    values.lead = id;
    values.docs = document;
    var data = JSON.stringify(values);
    var config = {
      method: "post",
      url: `${common.api_url}task`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token.jwt}`,
      },
      data: data,
    };

    axios(config)
      .then(
        function (response) {
          formik.values.taskName = "";
          formik.values.dueDate = "";
          formik.values.time = "";
          formik.values.assignTo = "";
          formik.values.details = "";
          formik.values.docs = "";
          swal("Good job!", "Lead Added Successfully", "success");
          getData();
          setModal(false);
        },
        (err) => {
          swal(err.response.data.message);
        }
      )
      .catch(function (error) {
        console.log(error);
      });
  };
  const uploadDocument = (e) => {
    let payload = {
      sampleFile: e.target.files[0],
    };
    var data = new FormData();
    data.append("sampleFile", payload.sampleFile);
    var config = {
      method: "post",
      url: `${common.api_url}upload`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(
        function (response) {
          setDocument(response.data.name);
        },
        (err) => {
          swal(err.response.data.message);
        }
      )
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <>
      <button
        className="btn btn-danger text-center  mb-5"
        onClick={(e) => {
          openAddModel();
        }}
      >
        Add Task
      </button>
      {task.map((ele, key) => (
        <div class="card text-white bg-primary mb-3 card1">
          <div class="card-header">Task Name: {ele.taskName}</div>
          <div class="card-body">
            <h5 class="card-title">Assign By : {ele.assignBy.name}</h5>
            <h5 class="card-title">Assign to : {ele.assignTo.name}</h5>
            <p class="card-text">Details:{ele.details}</p>
            <p class="card-text">Time:{ele.time}</p>
            <p class="card-text">Due Date: {ele.dueDate}</p>
            <a href={`${common.img_url}${ele.docs}`} download><h5 className="text-dark">download the docs</h5></a>
          </div>
        </div>
      ))}

      <Modal isOpen={modal} toggle={toggle} className="add-user-modal">
        <ModalHeader toggle={toggle}>Add New Lead</ModalHeader>
        <ModalBody>
          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <div>
              <label htmlFor="name">Task Name</label>
              <input
                id="taskName"
                name="taskName"
                className="form-control"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.taskName}
              />
              <span className="text-danger">{formik.errors.taskName}</span>
            </div>
            <div>
              <label htmlFor="details">Task Details</label>
              <textarea
                id="details"
                name="details"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.details}
              />
              <span className="text-danger">{formik.errors.details}</span>
            </div>
            <div>
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                name="dueDate"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.dueDate}
              />
              <span className="text-danger">{formik.errors.dueDate}</span>
            </div>
            <div>
              <label htmlFor="time">Time</label>
              <input
                id="time"
                name="time"
                type="time"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.time}
                min="00:00"
                max="24:00"
              />
              <span className="text-danger">{formik.errors.time}</span>
            </div>
            <div className="mt-3">
              <label htmlFor="assignTo">Assign To User</label>
              <select
                className="form-control"
                name="assignTo"
                id="assignTo"
                value={formik.values.assignTo}
                onChange={formik.handleChange}
              >
                <option value="">select a user</option>
                {users.map((ele, key) => (
                  <option value={ele._id} key={key}>
                    {ele.name}
                  </option>
                ))}
              </select>
              <span className="text-danger">{formik.errors.assignTo}</span>
            </div>
            <div>
              <label htmlFor="docs">Upload Document</label>
              <input
                id="file"
                name="file"
                type="file"
                className="form-control"
                onChange={(e) => {
                  uploadDocument(e);
                }}
                min="00:00"
                max="24:00"
              />
              <span className="text-danger">{formik.errors.docs}</span>
            </div>
            <button className="btn btn-danger text-center  mt-5" type="submit">
              Add Task
            </button>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};
export default Task;
