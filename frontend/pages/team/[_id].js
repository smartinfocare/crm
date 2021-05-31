import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import common from '../../helper/api'
import Navbar from "../../components/navbar";

const TeamView = () => {
  const router = useRouter();
  const id = router.query._id;
  const [team, setTeam] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getTeamData();
  }, []);

  const getTeamData = () => {
    var config = {
      method: "get",
      url: `${common.api_url}team/${id}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        setTeam(response.data);
        setUsers(response.data.members);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
    <Navbar/>
      <section className="our-webcoderskull padding-lg">
        <div className="container">
          <div className="row heading heading-icon">
            <h2 className="text-dark">{team.name}</h2>
          </div>
          <ul className="row">
            {users.map((ele, key) => (
              <li key={key} className="col-12 col-md-6 col-lg-3">
                <div className="cnt-block equal-hight">
                  <figure>
                    <img
                      src="http://www.webcoderskull.com/img/team4.png"
                      className="img-responsive"
                      alt=""
                    />
                  </figure>
                  <h3>{ele.name}</h3>
                  <p>{ele.email}</p>
                  <p>{ele.mobileNumber}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default TeamView;
