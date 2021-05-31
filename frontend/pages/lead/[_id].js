import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import common from "../../helper/api";
import Navbar from "../../components/navbar";
import Task from "../../components/task";
import Notes from "../../components/notes";

const LeadDetails = () => {
  const router = useRouter();
  const [id,setId]=useState(router.query._id);
  const [lead, setLead] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [user, setUser] = useState("");
  const [Team, setTeam] = useState("");

  useEffect(() => {
    getLeadData();
  }, []);

  const getLeadData = () => {
    var config = {
      method: "get",
      url: `${common.api_url}lead/${id}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        setLead(response.data.data);
        setSource(response.data.data.source);
        setStatus(response.data.data.status);
        setUser(response.data.data.assignUser);
        setTeam(response.data.data.assignTeam);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <div className="container my-container1 mt-5">
          
    <h1 className="h1 text-center">Lead Details</h1>
        <div className="row mt-5">

          <div className="col"></div>
          <div className="col">Lead Name:</div>
          <div className="col">{lead.name}</div>
          <div className="col">Email:</div>
          <div className="col">{lead.email}</div>
          <div className="col">Source:</div>
          <div className="col">{source.title}</div>
          <div className="col"> </div>
        </div>
        <div className="row mt-5">

          <div className="col"></div>
          {Team ? (
            <>
              <div className="col">Team:</div>
              <div className="col">{Team.name}</div>
            </>
          ) : (
            ""
          )}
          {user ? (
            <>
              <div className="col">User:</div>
              <div className="col">{user.name}</div>
            </>
          ) : (
            ""
          )}

          <div className="col">Company name:</div>
          <div className="col">{lead.companyName}</div>
          <div className="col">location:</div>
          <div className="col">{lead.location}</div>
          <div className="col"> </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 " >
            {" "}
            <Notes lead={id} />{" "}
          </div>
          <div className="col-md-6  my-area">
            {" "}
            <Task lead={id} />
          </div>
        </div>
      </div>
    </>
  );
};
export default LeadDetails;
