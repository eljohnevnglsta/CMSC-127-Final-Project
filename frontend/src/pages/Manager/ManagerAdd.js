import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
function ManagerAdd() {
  const username = useOutletContext();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const navigate = useNavigate();

  //adds the establishment by passing the username of the current user and the added details from the form
  const handleAddEstablishment = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/establishment/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        name: name,
        type: type,
        street: street,
        barangay: barangay,
        city: city,
        province: province,
      }),
    }).then(() => {
      setName(""); //empties the form after adding
      setType("");
      setCity("");
      setStreet("");
      setBarangay("");
      setProvince("");
      navigate(`/`); // Update state with the parsed data
    });
  };
  return (
    <div className="my-10 overflow-hidden mx-20 min-h-screen round shadow-lg ">
      <div className="py-10 px-20 ">
        <h1 className="font-bold text-4xl  text-sky-950">
          Add your business here!
        </h1>
        <div className="flex mt-4 ml-8  py-7 px-7 w-11/12 round">
          <form className="w-full" onSubmit={handleAddEstablishment}>
            <div className=" text-xl pb-4">
              <label className="font-bold mr-4">Name: </label>
              <br />
              <input
                placeholder="Name"
                className="p-4 border-slate-300 rounded-lg border h-10 mb-4 focus:shadow-md border-sky-950 py-2 text-large ml-4 w-11/12 text-sky-950"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <br />
            <div className=" text-xl pb-4">
              <label className="font-bold mr-4">Type: </label>
              <br />
              <input
                className="p-4 border-slate-300 rounded-lg border h-10 mb-4 focus:shadow-md border-sky-950 py-2 text-large ml-4 w-11/12 text-sky-950"
                type="text"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <br />
            <div className=" text-xl pb-4">
              <label className="font-bold mr-4">Street: </label>
              <br />
              <input
                className="p-4 border-slate-300 rounded-lg border h-10 mb-4 focus:shadow-md border-sky-950 py-2 text-large ml-4 w-11/12 text-sky-950"
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <br />
            <div className=" text-xl pb-4">
              <label className="font-bold mr-4">Barangay: </label>
              <input
                className="p-4 border-slate-300 rounded-lg border h-10 mb-4 focus:shadow-md border-sky-950 py-2 text-large ml-4 w-11/12 text-sky-950"
                type="text"
                required
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
              />
            </div>
            <br />
            <div className=" text-xl pb-4">
              <label className="font-bold mr-4">City: </label>
              <br />
              <input
                className="p-4 border-slate-300 rounded-lg border h-10 mb-4 focus:shadow-md border-sky-950 py-2 text-large ml-4 w-11/12 text-sky-950"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <br />
            <div className=" text-xl pb-4">
              <label className="font-bold mr-4">Province: </label>
              <br />
              <input
                className="p-4 border-slate-300 rounded-lg border h-10 mb-4 focus:shadow-md border-sky-950 py-2 text-large ml-4 w-11/12 text-sky-950"
                type="text"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
            </div>
            <br />

            <button
              className="bg-sky-950 py-3 px-6 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150"
              type="submit"
            >
              Confirm
            </button>
            <Link to={`/`}>
              <button className="bg-red-800 py-3 px-6 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-red-950 ease-out duration-150">
                Cancel
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ManagerAdd;
