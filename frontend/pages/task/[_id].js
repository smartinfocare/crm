import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import common from '../../helper/api'
import Navbar from "../../components/navbar";
import { useCookies } from "react-cookie";
import TaskNotes from "../../components/taskNotes";


const TaskDetail = () => {
  const router = useRouter();
  const [task, setTask] = useState("");
  const [lead, setLead] = useState("");
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [id, setId] = useState(router.query._id);

  const [Token, setToken] = useCookies(["jwt"]);
  useEffect(() => {
    getTaskData();
  }, []);

  const getTaskData = () => {
    var config = {
      method: "get",
      url: `${common.api_url}getTaskById/${id}`,
      headers: {
          "Authorization":`Bearer ${Token.jwt}`
      },
    };

    axios(config)
      .then(function (response) {
          debugger
        setTask(response.data.data);
        setLead(response.data.data.lead);
        setUser1(response.data.data.assignTo);
        setUser2(response.data.data.assignBy);
      })
      .catch(function (error) {
        console.log(error);
      }); 
  };

  return (
    <>
    <Navbar/>
        

<div class="container mt-5">

<div class="alert alert-info">
    <h2 className="text-secondary">{task.taskName}</h2>
    <p>{task.details}</p>
</div>

<hr />

<div class="method">
    <div class="row margin-0 list-header hidden-sm hidden-xs">
        <div class="col-md-3"><div class="header">Assigned By</div></div>
        <div class="col-md-2"><div class="header">Due Date</div></div>
        <div class="col-md-2"><div class="header">Time</div></div>
        <div class="col-md-3"><div class="header">lead</div></div>
        <div class="col-md-2"><div class="header">Docs</div></div>
    </div>
    <div class="row margin-0">
        <div class="col-md-3">
            <div class="cell">
                <div class="propertyname">
                    {user2.name} 
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="cell">
                <div class="type">
                    <code>{task.dueDate}</code>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="cell">
                <div class="isrequired">
                    {task.time}
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="cell">
                <div class="description">
                    {lead.name}
                </div>
            </div>
        </div><div class="col-md-2">
            <div class="cell">
                <div class="description">
                   <a href={`${common.img_url}${task.docs}`} download>check the docs</a>
                </div>
            </div>
        </div>
    </div>

</div>
</div>
<div className="mt-5">
    <TaskNotes id={id}/>
    </div>
    </>
  );
};

export default TaskDetail;
