import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import common from "../../helper/api";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import axios from "axios";
import swal from "sweetalert";
import Link from "next/link";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "reactstrap";
import Navbar from "../../components/navbar";

// define variable for add TASK
const initialValues = {
  taskName: "",
  dueDate: "",
  time: "",
  assignTo: "",
  details: "",
  lead: "",
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
  if (!values.lead) {
    errors.lead = " lead is required";
  }

  return errors;
};

const Task = () => {
  const [task, setTask] = useState([]);
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const router = useRouter();
  const [id, setId] = useState("");
  const [Token, setToken] = useCookies(["jwt"]);
  const [document, setDocument] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [delId, setDelId] = useState("");

  //   add  modal
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // edit modal for update the task
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);

  // delete confirmation for delete the task
  const [modal1, setModal1] = useState(false);
  const toggle1 = () => setModal1(!modal1);


  // render when the component open
  useEffect(() => {
    if (Token && Token.jwt) {
      getData();
      getUsers();
      getLeads();
      return <></>;
    } else {
      return router.push("/login ");
    }
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

  //   show create task form
  const openAddModel = () => {
    setModal(true);
  };

  // using formik form for submit ,validate
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (!isUpdate) {
        console.log(values);
        onSubmit(values);
      } else {
        updateTaskById(values);
      }
    },
    validate,
  });

  // update team
  const updateTaskById = (values) => {
    values.docs = document;
    var data = JSON.stringify(values);
    var config = {
      method: "put",
      url: `${common.api_url}task/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token.jwt}`,
      },
      data: data,
    };

    axios(config)
      .then(
        function (response) {
          swal(response.data.message);
          setId("");
          setModal2(false);
          getData();
        },
        (error) => {
          swal(error.response.data.message);
        }
      )
      .catch(function (error) {
        console.log(error);
      });
  };
  // getting team by id for updation
  const getTaskById = (id) => {
    var config = {
      method: "get",
      url: `${common.api_url}getTaskById/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token.jwt}`,
      },
    };
    axios(config)
      .then(function (response) {
        let data = response.data.data;
        formik.values.taskName = data.taskName;
        formik.values.dueDate = data.dueDate;
        formik.values.time = data.time;
        formik.values.assignTo = data.assignTo._id;
        formik.values.details = data.details;
        formik.values.lead = data.lead._id;
        setModal2(true);
        setIsUpdate(true);
        setId(data._id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getLeads = async () => {
    let res = await fetch(`${common.api_url}getAllLeads`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "x-requested-with, x-requested-by",
        Authorization: `Bearer ${Token.jwt}`,
      },
    });

    let data = await res.json();
    setLeads(data.data);
  };

  const getData = async () => {
    let res = await fetch(`${common.api_url}getTaskByRoleAndUserId`, {
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
  //   submit the form using formik for create the lead
  const onSubmit = (values) => {
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

  const confirmationModal = (id) => {
    // console.log(id+"faffffffff");
    setDelId(id);
    setModal1(true);
  };

  // delete task by id
  const deleteTaskById = (id) => {
    var config = {
      method: "delete",
      url: `${common.api_url}task/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token.jwt}`,
      },
    };
    axios(config)
      .then(function (response) {
        swal(response.data.message);
        setModal1(false);
        getData();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const TaskData = task.map((ele, key) => {
    return (
      <tr key={key}>
        <td>{key}</td>
        <td>{ele.taskName}</td>
        {ele.assignBy._id == ele.assignTo._id? <td>Self</td>:<td>{ele.assignTo.name}</td>}
        <td>{ele.assignBy.name}</td>
        <td>
          {" "}
          <Link href={`/task/${ele._id}`}>
            <button className="btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-eye-fill"
                viewBox="0 0 16 16"
              >
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
              </svg>{" "}
            </button>
          </Link>
          <button
            onClick={(e) => {
              confirmationModal(ele._id);
            }}
            className="btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path
                fillRule="evenodd"
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              getTaskById(ele._id);
            }}
            className="btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pencil-square"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fillRule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
              />
            </svg>{" "}
          </button>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <h1 className="text-secondary text-center">Task</h1>

          <div className="col-md-4">
            <Button
              color="danger"
              onClick={(e) => {
                openAddModel();
              }}
            >
              Add Task
            </Button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="span5">
            <table className="table table-striped table-condensed">
              <thead>
                <tr>
                  <th>S.N.</th>
                  <th>Task Name</th>
                  <th>Assign To</th>
                  <th>Assign By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{TaskData}</tbody>
            </table>
          </div>
        </div>
      </div>

      {/* add task  */}
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
            <div className="mt-3">
              <label htmlFor="lead">Select Lead</label>
              <select
                className="form-control"
                name="lead"
                id="lead"
                value={formik.values.lead}
                onChange={formik.handleChange}
              >
                <option value="">select a lead</option>
                {leads.map((ele, key) => (
                  <option value={ele._id} key={key}>
                    {ele.name}
                  </option>
                ))}
              </select>
              <span className="text-danger">{formik.errors.lead}</span>
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

      {/* update team modal  */}
      <div>
        <Modal isOpen={modal2} toggle={toggle2} className="add-user-modal">
          <ModalHeader toggle={toggle2}>Update The Task</ModalHeader>
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
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
              <div className="mt-3">
                <label htmlFor="lead">Select Lead</label>
                <select
                  className="form-control"
                  name="lead"
                  id="lead"
                  value={formik.values.lead}
                  onChange={formik.handleChange}
                >
                  <option value="">select a lead</option>
                  {leads.map((ele, key) => (
                    <option value={ele._id} key={key}>
                      {ele.name}
                    </option>
                  ))}
                </select>
                <span className="text-danger">{formik.errors.lead}</span>
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
              <Button type="submit" className="btn btn-primary mt-5">
                Update
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button color="danger" className=" mt-5" onClick={toggle2}>
                Cancel
              </Button>
            </form>
          </ModalBody>
        </Modal>
      </div>
      <div>
        {/* confirm to delete  */}
        <Modal isOpen={modal1} toggle={toggle1} className="add-user-modal">
          <ModalBody>
            <h3>Are you Really Want to Delete this?</h3>
            <Button
              onClick={(e) => deleteTaskById(delId)}
              className="btn btn-primary mt-5"
            >
              Delete
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button color="danger" className="mt-5" onClick={toggle1}>
              Cancel
            </Button>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default Task;
