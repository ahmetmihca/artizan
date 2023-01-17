import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBContainer,
  MDBBtn,
  MDBRow,
} from "mdb-react-ui-kit";
import React from "react";
import { useEffect, useState } from "react";
import login_services from "../services/login_serv";
import metamask_operations from "../services/metamask";
import Cookies from "js-cookie";
import collection_services from "../services/collection_serv";
import "./style/css-mycollection.css";

function MyCollection() {
  const [collections, setCollections] = useState(0);

  useEffect(async () => {
    if (Cookies.get("token") == null) {
      window.location = "/";
    } else {
      let token = Cookies.get("token");

      let res = await collection_services.get_my_collection(token);
      console.log(res);

      if (res != null) {
        console.log(res.length);
        setCollections(res);
      }
    }
  }, []);

  let handleSubmit = async (event) => {
    event.preventDefault();

    let collection_id = event.target[0].value;
    let category = event.target[1].value;

    let res = await collection_services.change_collection_category(
      collection_id,
      category,
      Cookies.get("token")
    );

    alert(res.status);
  };

  return (
    <main>
      <MDBContainer>
        <MDBBtn
          style={{ marginTop: 17 }}
          color="light"
          href="/create-collection"
        >
          {" "}
          Create Collection 📐{" "}
        </MDBBtn>

        <MDBTable>
          <MDBTableHead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Artizan ID</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {collections
              ? collections.map((collection, i) => {
                  return (
                    <tr className="mycollection-table">
                      <th scope="row">
                        <img
                          className="mycollection-avatar"
                          src={
                            "http://localhost:3001/public/collections/" +
                            collection._id +
                            "_logo.png"
                          }
                        ></img>{" "}
                      </th>
                      <td>{collection._id}</td>
                      <td>{collection.name}</td>
                      <td>{collection.description}</td>
                    </tr>
                  );
                })
              : "..."}
          </MDBTableBody>
        </MDBTable>
      </MDBContainer>
    </main>
  );
}

export default MyCollection;
