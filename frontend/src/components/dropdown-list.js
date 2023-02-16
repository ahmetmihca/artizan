import login_services from "../services/login_serv";
import user_services from "../services/user_serv";

var navBarObjects = {
  Explore: ["All Nfts"],
  Profile: [
    "Favorites",
    "Watchlist",
    "My Collections",
    "My Memberships",
    "Settings",
    "Logout",
  ],
};

if (localStorage.getItem("isWhitelisted") === "false") {
  navBarObjects.Profile = [
    "Favorites",
    "Watchlist",
    "My Memberships",
    "Settings",
    "Logout",
  ];
}

function logoutHandler() {
  login_services.logout();
}

function DropdownList(props) {
  const ddlinks = navBarObjects[props.dropdowntype];
  let sty = {};
  if (props.dropdowntype == "Profile") {
    sty = {
      width: "9.5em",
    };
  }
  return (
    <div className="dropdown-content" style={sty}>
      {ddlinks.map((ddlink, index) => {
        return (
          // console.log(ddlink);
          <span>
            {ddlink == "Logout" ? (
              <a
                key={index}
                href="#"
                onClick={() => {
                  logoutHandler();
                }}
              >
                {ddlink}
              </a>
            ) : (
              <a
                key={index}
                href={"/" + ddlink.replace(" ", "_").toLowerCase()}
                aria-current="page"
              >
                {ddlink}
              </a>
            )}
          </span>
        );
      })}
      {/* <a href="#" aria-current="page" >Explore</a>
        <a href="#" aria-current="page" >Explore</a>
        <a href="#" aria-current="page" >Explore</a> */}
    </div>
  );
}

export default DropdownList;
