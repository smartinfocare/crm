import axios from "axios";
import common from "../../helper/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import Switch from "react-switch";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "reactstrap";
import swal from "sweetalert";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Navbar from "../../components/navbar";


// define variable for add lead
const initialValues = {
  name: "",
  source: "",
  status: "",
  phoneNumber: "",
  email: "",
  companyName: "",
  location: "",
  assignTeam: "",
  assignUser: "",
};

// validate all the value to add lead
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
  if (!values.source) {
    errors.source = " source is required";
  }
  if (!values.status) {
    errors.status = " status is required";
  }
  if (!values.phoneNumber) {
    errors.phoneNumber = " Phone Number is required";
  }
  if (!values.companyName) {
    errors.companyName = " Company Name is required";
  }
  if (!values.location) {
    errors.location = " location Name is required";
  }

  return errors;
};

const Lead = () => {
  const [leads, setLeads] = useState([]);
  const [sources, setSources] = useState([]);
  const [status, setStatus] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isAssignTo, setIsAssignTo] = useState("");
  const [delId, setDelId] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // delete confirmation for delete the lead
  const [modal1, setModal1] = useState(false);
  const toggle1 = () => setModal1(!modal1);

  // edit modal for update the lead
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);


  const router = useRouter();
  const [Token, setToken] = useCookies(["jwt"]);


  // render when the component open
  useEffect(() => {
    if (Token && Token.jwt) {
      getData();
      getStatus();
      getSource();
      getUsers();
      getTeams();
     return (
       <>
       </>
     );
    
   } else {
     return router.push("/login ");
   }
  
  }, []);

  // update the status of lead
  const changeStatus = (e) => {
    var data = JSON.stringify(e);
    var config = {
      method: "put",
      url: `${common.api_url}changeLeadStatus`,
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

   // update the source of lead
  const changeSource = (e) => {
    var data = JSON.stringify(e);
    var config = {
      method: "put",
      url: `${common.api_url}changeLeadSource`,
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

  
  // update deal
  const updateLeadById = (values) => {
    var data = JSON.stringify(values);
    var config = {
      method: "put",
      url: `${common.api_url}lead/${id}`,
      headers: {
        "Content-Type": "application/json",
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
  const getLeadById = (id) => {

    var config = {
      method: "get",
      url: `${common.api_url}lead/${id}`,
    };
    axios(config)
      .then(function (response) {
        let data = response.data;
        formik.values.assignUser = data.assignUser ? data.assignUser : "";
        formik.values.assignTeam = data.assignTeam ? data.assignTeam : "";
        formik.values.email = data.email;
        formik.values.companyName = data.companyName;
        formik.values.location = data.location;
        formik.values.name = data.name;
        formik.values.status = data.status;
        formik.values.source = data.source;
        formik.values.phoneNumber = data.phoneNumber;
        setModal2(true);
        setIsUpdate(true);
        setId(data._id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //   confirmation for delete
  const confirmationModal = (id) => {
    // console.log(id+"faffffffff");
    setDelId(id);
    setModal1(true);
  };

  //   check for assign lead to user or team
  const onHandleChange = (e) => {
    if (e == 1) {
      setIsAssignTo(e);
      formik.values.assignTeam = "";
    } else {
      setIsAssignTo(e);
      formik.values.assignUser = "";
    }
  };

  // delete LEAD by id
  const deleteLeadById = (id) => {
    var config = {
      method: "delete",
      url: `${common.api_url}lead/${id}`,
      headers: {
        "Content-Type": "application/json",
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

  //   get source api call
  const getSource = async () => {
    let res = await fetch(`${common.api_url}sources`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "x-requested-with, x-requested-by",
      },
    });
    let data = await res.json();
    setSources(data);
  };

  //   get status api call
  const getStatus = async () => {
    let res = await fetch(`${common.api_url}status`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "x-requested-with, x-requested-by",
      },
    });
    let data = await res.json();
    setStatus(data);
  };

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

  //   get team api call
  const getTeams = async () => {
    let res = await fetch(`${common.api_url}teams`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "x-requested-with, x-requested-by",
        "Authorization": `Bearer ${Token.jwt}`
      },
    });
    let data = await res.json();
    setTeams(data.data);
  };

  //   show create lead form
  const openAddModel = () => {
    formik.values.assignUser = "";
    formik.values.assignTeam = "";
    formik.values.email = "";
    formik.values.companyName = "";
    formik.values.location = "";
    formik.values.name = "";
    formik.values.status = "";
    formik.values.source = "";
    formik.values.phoneNumber = "";
    getStatus();
    getSource();
    getUsers();
    getTeams();
    setIsUpdate(false)
    setModal(true);
  };

  // using formik form for submit ,validate
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (!isUpdate) {
        onSubmit(values);
      } else {
        updateLeadById(values);
      }
    },
    validate,
  });

  //   submit the form using formik for create the lead
  const onSubmit = (values) => {
    var data = JSON.stringify(values);
    var config = {
      method: "post",
      url: `${common.api_url}lead`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(
        function (response) {
          formik.values.assignUser = "";
          formik.values.assignTeam = "";
          formik.values.email = "";
          formik.values.companyName = "";
          formik.values.location = "";
          formik.values.name = "";
          formik.values.status = "";
          formik.values.source = "";
          formik.values.phoneNumber = "";
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

  //   get lsiting of leads
  const getData = async () => {
    let res = await fetch(`${common.api_url}lead`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "x-requested-with, x-requested-by",
        "Authorization": `Bearer ${Token.jwt}`
      },
    });
    let data = await res.json();
    setLeads(data.data);
  };

  // show listing of lead in table
  var leadData = leads
    .filter((val) => {
      if (search == "") {
        return val;
      } else if (val.source._id == search) {
        return val;
      }
    })
    .filter((val) => {
      if (statusSearch == "") {
        return val;
      } else if (val.status._id == statusSearch) {
        return val;
      }
    })
    .map((ele, key) => {
      return (
        <tr key={ele._id}>
          <td>{key}</td>
          <td>{ele.name}</td>
          <td>{ele.phoneNumber} </td>
          <td>{ele.email} </td>
          <td>{ele.companyName} </td>
          {ele.assignTeam != null ? <td>Team:{ele.assignTeam.name} </td> : ""}
          {ele.assignUser != null ? <td>User:{ele.assignUser.name} </td> : ""}
          <td>
          <select
            value={ele.status._id}
            onChange={(e) => changeStatus({ status: e.target.value, _id: ele._id })}
            className="form-control"
          >
            {status.map((ele, key) => (
              <option value={ele._id} key={key}>
                {ele.title}
              </option>
            ))}
          </select></td>
          <td>
          <select
            value={ele.source._id}  
            onChange={(e) => changeSource({ source: e.target.value, _id: ele._id })}
            className="form-control"
          >
            {sources.map((ele, key) => (
              <option value={ele._id} key={key}>
                {ele.title}
              </option>
            ))}
          </select></td>
          <td>
            <Link href={`/lead/${ele._id}`}>
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
              className="btn"
              onClick={(e) => {
                getLeadById(ele._id);
              }}
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
    <Navbar/>
      <div className="container mt-5">
        <div className="row">
          <h1 className="text-secondary text-center">Leads</h1>

          <div className="col-md-4">
            <Button
              color="danger"
              onClick={(e) => {
                openAddModel();
              }}
            >
              Add Lead
            </Button>
          </div>
          <div className="col-md-4">
            <select
              className="form-control"
              onChange={(e) => setStatusSearch(e.target.value)}
            >
              <option value={""}>Search by Status</option>
              {status.map((ele, key) => (
                <option value={ele._id} key={key}>
                  {ele.title}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-control"
              onChange={(e) => setSearch(e.target.value)}
            >
              <option value={""}>Search by Source</option>
              {sources.map((ele, key) => (
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
                  <th>S.N.</th>
                  <th>Name</th>
                  <th>mobile</th>
                  <th>Email</th>
                  <th>Company Name</th>
                  <th>Assign to</th>
                  <th>Status </th>
                  <th>Source </th>
                  <th>Action </th>
                </tr>
              </thead>
              <tbody>{leadData}</tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        {/* add new source  */}
        <Modal isOpen={modal} toggle={toggle} className="add-user-modal">
          <ModalHeader toggle={toggle}>Add New Lead</ModalHeader>
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
                <label htmlFor="source">Source</label>
                <select
                  className="form-control"
                  name="source"
                  id="source"
                  value={formik.values.source}
                  onChange={formik.handleChange}
                >
                  <option>select a value</option>
                  {sources.map((ele, key) => (
                    <option value={ele._id} key={key}>
                      {ele.title}
                    </option>
                  ))}
                </select>
                <span className="text-danger">{formik.errors.source}</span>
              </div>
              <div>
                <label htmlFor="status">Status</label>
                <select
                  className="form-control"
                  name="status"
                  id="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  <option>select a value</option>
                  {status.map((ele, key) => (
                    <option value={ele._id} key={key}>
                      {ele.title}
                    </option>
                  ))}
                </select>
                <span className="text-danger">{formik.errors.status}</span>
              </div>
              <div>
                <label htmlFor="phoneNumber">Mobile No.</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  className="form-control"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.phoneNumber}
                />
                <span className="text-danger">{formik.errors.phoneNumber}</span>
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  className="form-control"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <span className="text-danger">{formik.errors.email}</span>
              </div>
              <div>
                <label htmlFor="companyName">Company Name</label>
                <input
                  id="companyName"
                  name="companyName"
                  className="form-control"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.companyName}
                />
                <span className="text-danger">{formik.errors.companyName}</span>
              </div>
              <div>
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  className="form-control"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.location}
                />
                <span className="text-danger">{formik.errors.location}</span>
              </div>
              <div className="mt-3 ">
                <label htmlFor="status">Select One To Assign Lead</label>
                <select
                  className="form-control"
                  name="assignUser"
                  id="assignUser"
                  value={isAssignTo}
                  onChange={(e) => onHandleChange(e.target.value)}
                >
                  <option value="">assign type</option>
                  <option value="1">User</option>
                  <option value="2">Team</option>
                </select>
              </div>
              {isAssignTo == 1 ? (
                <div className="mt-3">
                  <label htmlFor="assignUser">Assign To User</label>
                  <select
                    className="form-control"
                    name="assignUser"
                    id="assignUser"
                    value={formik.values.assignUser}
                    onChange={formik.handleChange}
                  >
                    <option>select a user</option>
                    {users.map((ele, key) => (
                      <option value={ele._id} key={key}>
                        {ele.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-danger">
                    {formik.errors.assignUser}
                  </span>
                </div>
              ) : (
                ""
              )}
              {isAssignTo == 2 ? (
                <div className="mt-3">
                  <label htmlFor="assignTeam">Assign to Team</label>
                  <select
                    className="form-control"
                    name="assignTeam"
                    id="assignTeam"
                    value={formik.values.assignTeam}
                    onChange={formik.handleChange}
                  >
                    <option>select a team</option>
                    {teams.map((ele, key) => (
                      <option value={ele._id} key={key}>
                        {ele.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-danger">
                    {formik.errors.assignTeam}
                  </span>
                </div>
              ) : (
                ""
              )}
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
      <div>
        {/* confirm to delete  */}
        <Modal isOpen={modal1} toggle={toggle1} className="add-user-modal">
          <ModalBody>
            <h3>Are you Really Want to Delete this?</h3>
            <Button
              onClick={(e) => deleteLeadById(delId)}
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

      <div>
        {/* add new source  */}
        <Modal isOpen={modal2} toggle={toggle2} className="update-lead-modal">
          <ModalHeader toggle={toggle2}>Update The Lead</ModalHeader>
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
                <label htmlFor="source">Source</label>
                <select
                  className="form-control"
                  name="source"
                  id="source"
                  value={formik.values.source}
                  onChange={formik.handleChange}
                >
                  <option>select a value</option>
                  {sources.map((ele, key) => (
                    <option value={ele._id} key={key}>
                      {ele.title}
                    </option>
                  ))}
                </select>
                <span className="text-danger">{formik.errors.source}</span>
              </div>
              <div>
                <label htmlFor="status">Status</label>
                <select
                  className="form-control"
                  name="status"
                  id="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  <option>select a value</option>
                  {status.map((ele, key) => (
                    <option value={ele._id} key={key}>
                      {ele.title}
                    </option>
                  ))}
                </select>
                <span className="text-danger">{formik.errors.status}</span>
              </div>
              <div>
                <label htmlFor="phoneNumber">Mobile No.</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  className="form-control"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.phoneNumber}
                />
                <span className="text-danger">{formik.errors.phoneNumber}</span>
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  className="form-control"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <span className="text-danger">{formik.errors.email}</span>
              </div>
              <div>
                <label htmlFor="companyName">Company Name</label>
                <input
                  id="companyName"
                  name="companyName"
                  className="form-control"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.companyName}
                />
                <span className="text-danger">{formik.errors.companyName}</span>
              </div>
              <div>
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  className="form-control"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.location}
                />
                <span className="text-danger">{formik.errors.location}</span>
              </div>
              <div className="mt-3 ">
                <label htmlFor="status">Select One To Assign Lead</label>
                <select
                  className="form-control"
                  name="assignUser"
                  id="assignUser"
                  value={isAssignTo}
                  onChange={(e) => onHandleChange(e.target.value)}
                >
                  <option value="">assign type</option>
                  <option value="1">User</option>
                  <option value="2">Team</option>
                </select>
              </div>
              {isAssignTo == 1 ? (
                <div className="mt-3">
                  <label htmlFor="assignUser">Assign To User</label>
                  <select
                    className="form-control"
                    name="assignUser"
                    id="assignUser"
                    value={formik.values.assignUser}
                    onChange={formik.handleChange}
                  >
                    <option value="">select a user</option>
                    {users.map((ele, key) => (
                      <option value={ele._id} key={key}>
                        {ele.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-danger">
                    {formik.errors.assignUser}
                  </span>
                </div>
              ) : (
                ""
              )}
              {isAssignTo == 2 ? (
                <div className="mt-3">
                  <label htmlFor="assignTeam">Assign to Team</label>
                  <select
                    className="form-control"
                    name="assignTeam"
                    id="assignTeam"
                    value={formik.values.assignTeam}
                    onChange={formik.handleChange}
                  >
                    <option value="">select a team</option>
                    {teams.map((ele, key) => (
                      <option value={ele._id} key={key}>
                        {ele.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-danger">
                    {formik.errors.assignTeam}
                  </span>
                </div>
              ) : (
                ""
              )}
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
        {/* view data  */}
      </div>
    </>
  );
};

export default Lead;
