import Link from "next/link";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import { useCookies } from "react-cookie";
const Navbar = () => {
    const router = useRouter();
    const LogOut = () =>{
        Cookie.remove('jwt');
        router.push('/');
    }
    const [Token, setToken] = useCookies(["jwt"]);
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand">Navbar</a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link my_link">
                <Link href="/dashboard">Users</Link>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link my_link">
                <Link href="/team">Team</Link>
              </a>
            </li>
            <li className="nav-item active">
              <a className="nav-link my_link">
                <Link href="/lead">Lead</Link>
              </a>
            </li> <li className="nav-item">
              <a className="nav-link my_link">
                <Link href="/sources">Source</Link>
              </a>
            </li>
            <li className="nav-item active">
              <a className="nav-link my_link">
                <Link href="/status">Status</Link>
              </a>
            </li>
          </ul>
    {Token && Token.jwt? <button className="btn btn-success float-right my-2 my-sm-0"   onClick={(e) => {
                LogOut();
              }}>Logout</button>:''}
   
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
