import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";

const viewData = () => {
  const [singleUser, setSingleUser] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    getSingleUser();
  }, []);

  const getSingleUser = () => {
    var config = {
      method: "get",
      url: `http://localhost:8080/api/user/${id}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        setSingleUser(response.data);
        setRole(response.data.role);
      })
      .catch(function (error) {
        console.log(error);
      });
  };


  return (
    <>
    <Navbar/>
      <div className="container mt-5 bg-primary text-white">
        <div className="row-fluid row">
          <div className="col-md-4"></div>
          <div className="span2">
            <img
              src="https://secure.gravatar.com/avatar/de9b11d0f9c0569ba917393ed5e5b3ab?s=140&r=g&d=mm"
              className="img-circle align-center my-img"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 ml-3"></div>
          <h1 className="text-center">{singleUser.name}</h1>
        </div>
        <div className="row mt-3">
          <div className="span8 col-md-7">
            <h3>Email: {singleUser.email}</h3>
            <h3>Contact: {singleUser.mobileNo}</h3>
          </div>
          <div className="span8">
            <h3>Role: {role.title}</h3>
            <h3>Status: {singleUser.status}</h3>
          </div>
        </div>
      </div>
    </>
  );
};


export default viewData;
