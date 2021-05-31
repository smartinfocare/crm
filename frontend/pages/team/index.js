import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  DropdownMenu,
} from "reactstrap";
import dynamic from "next/dynamic";
const Multiselect = dynamic(
  () =>
    import("multiselect-react-dropdown").then((module) => module.Multiselect),
  {
    ssr: false,
  }
);
import { useFormik } from "formik";
import swal from "sweetalert";
import Link from "next/link";
import axios from "axios";
import common from "../../helper/api";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Navbar from "../../components/navbar";

const initialValues = {
  name: "",
  members: [],
  teamLeader: "",
};

const validate = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = " name is required";
  }
  if (!values.members) {
    errors.members = "team members number is required";
  }
  if (!values.teamLeader) {
    errors.teamLeader = "Team leader is required";
  }
  return errors;
};

const Team = () => {
  const [TeamListing, setTeams] = useState([]);
  const [id, setId] = useState("");
  const [delId, setDelId] = useState("");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState([]);
  const [singleUser, setSingleUser] = useState("");
  const selectDta = [];
  const [isUpdate, setIsUpdate] = useState(false);

  // add team modal
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // delete confirmation for delete the team
  const [modal1, setModal1] = useState(false);
  const toggle1 = () => setModal1(!modal1);

  // edit modal for update the team
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);

  const router = useRouter();
  const [Token, setToken] = useCookies(["jwt"]);
 

  useEffect(() => {
    if (Token && Token.jwt) {
      getData();
      getUsers();
      return <></>;
    } else {
      return router.push("/login ");
    }
  }, []);

  // on remove and add members
  const onChangeValue = (e) => {
    formik.values.members = e;
  };

  // use formik for Create form
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (!isUpdate) {
        createTeam(values);
      } else {
        updateTeamById(values);
      }
    },
    validate,
  });

  // update team
  const updateTeamById = (values) => {
    var data = JSON.stringify(values);
    var config = {
      method: "put",
      url: `${common.api_url}team/${id}`,
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

  // add new team
  const createTeam = (values) => {
    var data = JSON.stringify(values);
    var config = {
      method: "post",
      url: `${common.api_url}team`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(
        function (response) {
          setModal(false);
          swal("Good job!", "team Added Successfully", "success");
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
  // get users data for dropdown
  const getUsers = () => {
    var config = {
      method: "get",
      url: `${common.api_url}users`,
    };

    axios(config)
      .then(function (response) {
        setUser(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // getting team by id for updation
  const getTeamById = (id) => {

    var config = {
      method: "get",
      url: `${common.api_url}team/${id}`,
    };

    axios(config)
      .then(function (response) {
        let data = response.data;
        formik.values.name = data.name;
        formik.values.teamLeader = data.teamLeader;
        formik.values.members = data.members;
        setModal2(true);
        setIsUpdate(true);
        setId(data._id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // open the modal of update team
  const openAddTeamToggle = () => {
    setIsUpdate(false);
    formik.values.name = "";
    formik.values.teamLeader = "";
    formik.values.members = "";
    setModal(true);
  };
  // get team data for listing
  const getData = async () => {
    let res = await fetch(`${common.api_url}teams`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "x-requested-with, x-requested-by",
        Authorization: `Bearer ${Token.jwt}`,
      },
    });
    let data = await res.json();
    setTeams(data.data);
  };

  // delete team by id
  const deleteTeamById = (id) => {
    var config = {
      method: "delete",
      url: `${common.api_url}team/${id}`,
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

  const confirmationModal = (id) => {
    // console.log(id+"faffffffff");
    setDelId(id);
    setModal1(true);
  };
  // Team listing
  var userData = TeamListing.map((ele, key) => {
    return (
      <tr key={key}>
        <td>{ele.name}</td>
        <td>{ele.members.length} </td>
        <td>{ele.teamLeader.name}</td>
        <td>
          <Link href={`team/${ele._id}`}>
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
              getTeamById(ele._id);
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
    <Navbar/>
      <div className="container mt-5">
        <h1 className="text-secondary">Team Management</h1>
        <div className="row">
          <div className="col-md-6">
            <Button color="danger" onClick={openAddTeamToggle}>
              Add Team
            </Button>
          </div>
          <div className="col-md-6"></div>
        </div>
        <div className="row mt-4">
          <div className="span5">
            <table className="table table-striped table-condensed">
              <thead>
                <tr>
                  <th>name</th>
                  <th>Members</th>
                  <th>Team Leader</th>
                  <th className="text">Action</th>
                </tr>
              </thead>
              <tbody>{userData}</tbody>
            </table>
          </div>
        </div>
      </div>

      {/* add team modal  */}
      <div>
        <Modal isOpen={modal} toggle={toggle} className="add-user-modal">
          <ModalHeader toggle={toggle}>Add New Team</ModalHeader>
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
                <label htmlFor="Team_Members">Team Members</label>

                <div>
                  <Multiselect
                    options={user}
                    displayValue="name"
                    id="members"
                    name="members"
                    selectedValues={formik.values.members}
                    showArrow
                    onRemove={(e) => {
                      onChangeValue(e);
                    }}
                    onSelect={(e) => {
                      onChangeValue(e);
                    }}
                  />
                </div>
                <span className="text-danger">{formik.errors.members}</span>
              </div>
              <div>
                <label htmlFor="role">Team Manager</label>
                <select
                  className="form-control"
                  name="teamLeader"
                  id="teamLeader"
                  value={formik.values.teamLeader}
                  onChange={formik.handleChange}
                >
                  <option>select a value</option>
                  {user.map((ele, key) => (
                    <option value={ele._id} key={key}>
                      {ele.name}
                    </option>
                  ))}
                </select>
                <span className="text-danger">{formik.errors.teamLeader}</span>
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
      </div>

      {/* update team modal  */}
      <div>
        <Modal isOpen={modal2} toggle={toggle2} className="add-user-modal">
          <ModalHeader toggle={toggle2}>Update The Team</ModalHeader>
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
                <label htmlFor="Team_Members">Team Members</label>
                <div>
                  <Multiselect
                    options={user}
                    displayValue="name"
                    id="members"
                    name="members"
                    selectedValues={formik.values.members}
                    onRemove={(e) => {
                      onChangeValue(e);
                    }}
                    showArrow
                    onSelect={(e) => {
                      onChangeValue(e);
                    }}
                  />
                  {/* <select
                    multiple={true}
                    value={formik.values.members}
                    name="members"
                    className="form-control"
                    onChange={formik.handleChange}
                    defaultValue={singleUser.members}
                  >
                    {user.map((item, key) => {
                      return (
                        <option key={key} value={item._id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select> */}
                </div>
                <span className="text-danger">{formik.errors.members}</span>
              </div>
              <div>
                <label htmlFor="role">Team Manager</label>

                <select
                  className="form-control"
                  name="teamLeader"
                  id="teamLeader"
                  value={formik.values.teamLeader}
                  onChange={formik.handleChange}
                >
                  <option>select a value</option>
                  {user.map((ele, key) => (
                    <option value={ele._id} key={key}>
                      {ele.name}
                    </option>
                  ))}
                </select>
                <span className="text-danger">{formik.errors.teamLeader}</span>
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
              onClick={(e) => deleteTeamById(delId)}
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

export default Team;
