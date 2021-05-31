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
  subject: "",
  title:""
};

// validate all the value to add TASK
const validate = (values) => {
  let errors = {};
  if (!values.subject) {
    errors.subject = " details  is required";
  }if (!values.title) {
    errors.title = " title is required";
  }
  return errors;
};

const Notes = (props) =>{
    const [notes, setNotes] = useState([]);
    const [Token, setToken] = useCookies(["jwt"]);
    const [document, setDocument] = useState("");
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [id, setId] = useState(props.lead);

    useEffect(() => {
        getData();
      }, []);

        //   show create notes form
  const openAddModel = () => {
    setModal(true);
  };
  const getData = async () => {
    let res = await fetch(`${common.api_url}getNotesByLeadId/${id}`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "x-requested-with, x-requested-by",
        Authorization: `Bearer ${Token.jwt}`,
      },
    });
    let data = await res.json();
    setNotes(data.data);
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


  //   submit the form using formik for create the notes
  const onSubmit = (values) => {
    values.lead = id;
    values.docs = document;
    var data = JSON.stringify(values);
    var config = {
      method: "post",
      url: `${common.api_url}notes`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token.jwt}`,
      },
      data: data,
    };

    axios(config)
      .then(
        function (response) {
          formik.values.title = "";
          formik.values.subject = "";
          swal("Good job!", "Notes Added Successfully", "success");
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
  
return(
    <>
    <button
      className="btn btn-primary text-center  mb-5"
      onClick={(e) => {
        openAddModel();
      }}
    >
      Add Notes
    </button>
    {notes.map((ele, key) => (
      <div class="card text-white bg-danger mb-3 card1" key={key}>
        <div class="card-header">Task Name: {ele.title}</div>
        <div class="card-body">
          <h5 class="card-title">Assign By : {ele.addedBy.name}</h5>
          <p class="card-text">Details:{ele.subject}</p>
          <a href={`${common.img_url}${ele.docs}`} download><h5 className="text-dark">download the docs</h5></a>
        </div>
      </div>
    ))}

    <Modal isOpen={modal} toggle={toggle} className="add-user-modal">
      <ModalHeader toggle={toggle}>Add New Notes</ModalHeader>
      <ModalBody>
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <div>
            <label htmlFor="title">Notes Title</label>
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
          <div>
            <label htmlFor="subject">Details</label>
            <textarea
              id="subject"
              name="subject"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.subject}
            />
            <span className="text-danger">{formik.errors.subject}</span>
          </div>
          <div>
            <label htmlFor="docs">Upload Document</label>
            <input
              id="file"
              name="file"
              type="file"
              multiple
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
            Add Notes
          </button>
        </form>
      </ModalBody>
    </Modal>
  </>
)
}

export default Notes;