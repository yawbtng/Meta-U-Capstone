import {useState, useEffect, useRef} from "react"
import { Search } from "lucide-react";

const SearchContacts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const typeaheadRef = useRef(null)

    const handleChange = (e) => {
        setSearchTerm(e.target.value)
    }


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (typeaheadRef.current && !typeaheadRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [typeaheadRef])

    return (
    <div className="relative w-2/3 !h-8 flex flex-col justify-center" ref={typeaheadRef}>
        <input type="text" placeholder="Search connections..." 
        value={searchTerm} onChange={handleChange} 
        className="outline-1 border border-gray-200 w-full rounded-md p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
        role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={showDropdown}/>
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700" />

        {searchTerm && showDropdown && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-sm shadow-md mt-1 z-10 pl-10 pr-4">
            {results.length > 0 ? (
                results.map((result, index) => (
                <li key={index} className="p-3 hover:bg-gray-100 cursor-pointer">
                    {result}
                </li>
                ))
            ) : (
                <p className="p-3 text-gray-500">No results found.</p>
            )}
            </ul>
        )}
    </div>
  )
}

export default SearchContacts;
