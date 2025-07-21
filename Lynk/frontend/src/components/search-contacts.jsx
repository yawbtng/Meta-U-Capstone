import {useState, useEffect, useRef} from "react"
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // ✅ ADD: Import Badge
import { Trie, fetchInitialContactsForSearch } from "../../../backend/index.js"
import { getInitials } from "./contacts-table-components/columns.jsx";
import AvatarDemo from "./avatar-01"
import { useDebounce } from "../lib/useDebounce.js"
import { UserAuth } from "../context/AuthContext.jsx"


const SearchResult = ({ contact, index }) => {
  const colorMap = {
    personal: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    professional: "bg-green-100 text-green-800 hover:bg-green-200",
    social: "bg-blue-100 text-blue-800 hover:bg-blue-200"
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
          {contact.relationship_type?.map((type, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className={`text-sm ${colorMap[type.toLowerCase()]}`}
            >
              {type}
            </Badge>
          ))}
        </div>

        <div className="flex items-center space-x-4 ml-2">
          <AvatarDemo initials={getInitials(contact.name)} url={contact.avatar_url} className="w-12 h-12 text-xl ml-2" />
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
    const [isLoading, setIsLoading] = useState(false);
    const [currentFirstChar, setCurrentFirstChar] = useState("");
    const typeaheadRef = useRef(null)
    const { session } = UserAuth();
    const debouncedSearchTerm = useDebounce(searchTerm);
    

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearchTerm.length === 0) {
                setResults([])
                setShowDropdown(false)
                setTrie(new Trie())
                setCurrentFirstChar("")
                return;
            }

            setIsLoading(true)

            try {
                const firstChar = debouncedSearchTerm[0].toLowerCase();
                
                
                if (firstChar !== currentFirstChar) {
                    const contacts = await fetchInitialContactsForSearch(session?.user?.id, firstChar)
                    const newTrie = new Trie();
                    newTrie.batchInsert(contacts)
                    setTrie(newTrie)
                    setCurrentFirstChar(firstChar)
                    setResults(newTrie.findContactsWithPrefix(debouncedSearchTerm))
                    setShowDropdown(true)
                } else {
                    
                    setResults(trie.findContactsWithPrefix(debouncedSearchTerm))
                    setShowDropdown(true)
                }
            } catch (error) {
                console.error("Error performing search:", error)
            } finally {
                setIsLoading(false)
            }
        }
        performSearch();
    }, [debouncedSearchTerm, currentFirstChar])

    const handleChange = async (e) => {
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
        <div className="relative w-2/4 !h-4 flex flex-col justify-center" ref={typeaheadRef}>
            <input type="text" placeholder="Search connections..." 
            value={searchTerm} onChange={handleChange} 
            className="outline-1 border border-gray-200 w-full rounded-md p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={showDropdown}/>
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700" />

            {searchTerm && showDropdown && (
                <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-sm shadow-md mt-4 z-10 ">
                {isLoading ? (
                            <div className="p-3 text-gray-500 flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                Searching...
                            </div>
                        ) : results.length > 0 ? (
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
