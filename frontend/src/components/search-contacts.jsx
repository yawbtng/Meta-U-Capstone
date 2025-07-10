import {useState, useEffect} from "react"

const SearchContacts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [result, setResult] = useState([]);


    const handleChange = (e) => {
        setSearchTerm(e.target.value)
    }

    return (
    <div className="w-2/3 !h-10 flex justify-center">
        <input type="text" placeholder="Search connections..." 
        value={searchTerm} onChange={handleChange} className="outline-2 border-gray-200 w-full rounded-sm p-3 text-xl"/>
      
    </div>
  )
}

export default SearchContacts;
