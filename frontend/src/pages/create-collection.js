import Navbar from "../components/navbar";
import UploadFile from "../components/upload-file";
import './style/css-create-collection.css';
import { MDBIcon, MDBDropdownMenu, MDBDropdownItem, MDBDropdown, MDBDropdownToggle, MDBContainer } from 'mdb-react-ui-kit';
import ImgUpload from "../components/img-upload";
import FormDropdown from "../components/form-dropdown";
import collection_services from "../services/collection_serv";
import Cookies from 'js-cookie';

function CreateCollection() {

    let handleSubmit = async (event) => {
        event.preventDefault()
        
        let logo = event.target[0].files[0]
        let featured = event.target[1].files[0]
        let banner = event.target[2].files[0]
        let name = event.target[3].value
        let description = event.target[4].value
        let earning = ""
        
        let token = Cookies.get('token');
        console.log(token);

        let res = await collection_services.create_collection(logo,featured,banner,name,description,earning,token, event.target);

        if (res != null) {
            alert("It has been succesfully created!");
        }

    }

    return (

        <main>
            
        <MDBContainer>
            <div id="create-collection">

                <form onSubmit={handleSubmit}>
                    <h1>Create a Collection</h1>
                    <h6>Logo image *</h6>
                    <p>This image will also be used for navigation. 350 x 350 recommended.</p>
                    <ImgUpload shape="circle" fileId="logo-img"></ImgUpload>
                    <h6>Featured Image</h6>
                    <p>This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of Artizan. 600 x 400 recommended.</p>
                    <ImgUpload fileId="feauterd-img" shape="rectangle" width="450px" height="300px"></ImgUpload>
                    <h6>Banner Image</h6>
                    <p>This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 400 recommended.</p>
                    <ImgUpload fileId="banner-img" shape="rectangle" width="700px" height="200px"></ImgUpload>

                    <hr className="solid"></hr>


                    <h6>Name *</h6>
                    <input type="text" name="collection-name" required placeholder="Apes" />


                    <h6>Description</h6>
                    <p>Markdown syntax is supported. Max: 1000 characters.</p>
                    <textarea name="description" id="description" rows="10"></textarea>
                    {/* <h6>Category</h6>
                    <p>Adding a category will help make your item discoverable on Artizan.</p>
                    <FormDropdown selected="art" values={["art", "football", "sth"]}
                        dropdownId="category-dropdown" dropdownName="category-dropdown"></FormDropdown> */}

                    {/* <h6>Creator Earnings</h6>
                    <p>Collect a fee when a user re-sells an item you originally created. This is deducted from the final sale price and paid monthly to a payout address of your choosing. As percentage.</p>
                    <input type="text" name="earning" placeholder="e.g. 2.5" />

                    <hr className="solid"></hr> */}

                    <button type="submit" className="btn-hover color-9" style={{ marginBottom: "10vh" }}>Create</button>

                </form>
            </div>
        </MDBContainer>
        </main>


    );
}

export default CreateCollection;