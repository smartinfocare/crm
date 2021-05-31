import UserListing from "../../components/users";
import Login from "../login/index";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useEffect } from "react";


const Dashboard = (props) => {

  return (
    <>
      <UserListing  />
    </>
  );
};

export default Dashboard;
