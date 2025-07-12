import {useState, useEffect, useRef} from "react"
import { Search } from "lucide-react";
import { Trie, fetchInitialContactsForSearch } from "../../../backend/index.js"
import { getInitials } from "./contacts-table-components/columns.jsx";
import AvatarDemo from "./avatar-01"


const SearchResult = ({ contact, index }) => {
  const colorMap = {
    personal: "bg-purple-100",
    professional: "bg-green-100",
    social: "bg-blue-100"
  };

  return (
    <li key={index} className="py-2 px-6 hover:bg-gray-100 cursor-pointer border-b border-gray-200">
      <div className="flex items-center justify-between">

        {/* Left Section: Name and Role */}
        <Search className=" transform  text-gray-700 mr-4 scale-80" />
         <div className="flex-1 text-left">
             
            <div className="text-lg font-semibold">{contact.name} | 
                <span className="text-sm text-gray-500 ml-1">{contact.role && contact.company ? `${contact.role} at ${contact.company}` : ''}</span>
            </div>
            
        </div>


        {/* Right Section: Relationship Type and Avatar */}
        <div className="flex space-x-2">
          {contact.relationship_type.map((type, index) => (
            <span key={index} className={`px-2 py-1 rounded ${colorMap[type.toLowerCase()]}`}>
              {type}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-4 ml-2">
          <AvatarDemo initials={getInitials(contact.name)} className="w-12 h-12 text-xl" />
        </div>
      </div>
    </li>
  );
};


const SearchContacts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [trie, setTrie] = useState(new Trie());
    const typeaheadRef = useRef(null)
    
    console.log(trie)

    const handleChange = async (e) => {
        const input = e.target.value
        setSearchTerm(input)

        if (input.length === 0) {
            setResults([])
            setShowDropdown(false)
            setTrie(new Trie())
        }

        if (input.length === 1) {
            const contacts = await fetchInitialContactsForSearch(input)
            const newTrie = new Trie();
            newTrie.batchInsert(contacts)
            setTrie(newTrie)
            setResults(newTrie.findContactsWithPrefix(input))
            setShowDropdown(true)
            console.log(results)
        } else {
            console.log(trie.findContactsWithPrefix(input))
            setResults(trie.findContactsWithPrefix(input))
            setShowDropdown(true)
            
        }
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
    <div className="relative w-2/4 !h-4 flex flex-col justify-center" ref={typeaheadRef}>
        <input type="text" placeholder="Search connections..." 
        value={searchTerm} onChange={handleChange} 
        className="outline-1 border border-gray-200 w-full rounded-md p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
        role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={showDropdown}/>
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700" />

        {searchTerm && showDropdown && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-sm shadow-md mt-4 z-10 ">
            {results.length > 0 ? (
                results.map((result, index) => (
                <SearchResult key={index} index={index} contact={result}/>
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
