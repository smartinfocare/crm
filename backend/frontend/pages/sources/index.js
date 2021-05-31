import axios from "axios";
import common from "../../helper/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Navbar,
} from "reactstrap";
import swal from "sweetalert";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

// define variable for add source
const initialValues = {
  title: "",
};

// validate all the value to add user
const validate = (values) => {
  let errors = {};
  if (!values.title) {
    errors.title = " title is required";
  }

  return errors;
};

const Source = () => {
  const [sources, setSources] = useState([]);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const router = useRouter();
  const [Token, setToken] = useCookies(["jwt"]);

  // render when the component open
  useEffect(() => {
    if (Token && Token.jwt) {
      getData();
      return <></>;
    } else {
      return router.push("/login ");
    }
  }, []);

  // using formik form for submit ,validate
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      onSubmit(values);
    },
    validate,
  });

  const onSubmit = (values) => {
    var data = JSON.stringify(values);
   
    var config = {
      method: "post",
      url: `${common.api_url}source`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(
        function (response) {
          setModal(false);
          swal("Good job!", "source Added Successfully", "success");
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

  const getData = async () => {
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

  // show listing of source in table
  var sourceData = sources.map((ele, key) => {
    return (
      <tr key={key}>
        <td>{key}</td>
        <td>{ele.title}</td>
        <td>{ele.createdAt} </td>
        <td>
          <Link href='#'>
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
        <div className="row">
          <h1 className="text-secondary text-center">Sources</h1>
          <div className="col-md-4">
            <Button color="danger" onClick={toggle}>
              Add Source
            </Button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="span5">
            <table className="table table-striped table-condensed">
              <thead>
                <tr>
                  <th>S.N.</th>
                  <th>Title</th>
                  <th>Created </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{sourceData}</tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        {/* add new source  */}
        <Modal isOpen={modal} toggle={toggle} className="add-user-modal">
          <ModalHeader toggle={toggle}>Add New Source</ModalHeader>
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  className="form-control"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.title}
                />
                <span className="text-danger">{formik.errors.title}</span>
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

export default Source;
