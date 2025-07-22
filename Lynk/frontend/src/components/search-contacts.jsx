import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Trie, fetchInitialContactsForSearch } from "../../../backend/index.js";
import { getInitials } from "./contacts-table-components/columns.jsx";
import AvatarDemo from "./avatar-01";
import { useDebounce } from "../lib/useDebounce.js";
import { UserAuth } from "../context/AuthContext.jsx";
import ViewContactCard from "./ViewContactCard";

const SearchResult = ({ contact }) => {
  const colorMap = {
    personal: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    professional: "bg-green-100 text-green-800 hover:bg-green-200",
    social: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  };

  return (
    <div className="flex items-center justify-between">
      <Search className="text-gray-700 mr-4 scale-80" />

      <div className="flex-1 text-left">
        <div className="text-lg font-semibold">
          {contact.name}
          {contact.role && contact.company && (
            <>
              {" "}
              |{" "}
              <span className="text-sm text-gray-500">
                {`${contact.role} at ${contact.company}`}
              </span>
            </>
          )}
        </div>
      </div>

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
        <AvatarDemo initials={getInitials(contact.name)} url={contact.avatar_url} className="w-12 h-12 text-xl ml-2"/>
      </div>
    </div>
  );
};

const SearchContacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [trie, setTrie] = useState(new Trie());
  const [isLoading, setIsLoading] = useState(false);
  const [currentFirstChar, setCurrentFirstChar] = useState("");

  // Modal state
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // keyboard-navigation state 
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = nothing highlighted
  const optionRefs = useRef([]);

  const typeaheadRef = useRef(null);
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
          const contacts = await fetchInitialContactsForSearch(session?.user?.id, firstChar);
          const newTrie = new Trie();
          newTrie.batchInsert(contacts)
          setTrie(newTrie)
          setCurrentFirstChar(firstChar)
          setResults(newTrie.findContactsWithPrefix(debouncedSearchTerm))
        } else {
          setResults(trie.findContactsWithPrefix(debouncedSearchTerm))
        }

        setShowDropdown(true);
      } catch (err) {
        console.error("Error performing search:", err)
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [debouncedSearchTerm, currentFirstChar]);

  // reset highlight when list changes
  useEffect(() => {
    setActiveIndex(-1);
    optionRefs.current = [];
  }, [results]);

  // keep highlighted item in view
  useEffect(() => {
    if (activeIndex >= 0 && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // close dropdown on outside click 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (typeaheadRef.current && !typeaheadRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => setSearchTerm(e.target.value);

  const handleSelect = (contact) => {
    setSearchTerm(contact.name);
    setShowDropdown(false);
    setSelectedContact(contact);
    setModalOpen(true);
  };

  return (
    <>
      <div
        ref={typeaheadRef}
        className="relative w-2/4 !h-4 flex flex-col justify-center"
      >
        <input type="text" placeholder="Search connections..." 
        value={searchTerm} onChange={handleChange}
          onKeyDown={(e) => {
            if (!showDropdown) return;
            switch (e.key) {
              case "ArrowDown":
                e.preventDefault();
                setActiveIndex((prev) =>
                  results.length ? (prev + 1) % results.length : -1
                );
                break;
              case "ArrowUp":
                e.preventDefault();
                setActiveIndex((prev) =>
                  results.length ? prev <= 0 ? results.length - 1 : prev - 1 : -1);
                break;
              case "Enter":
                if (activeIndex >= 0 && activeIndex < results.length) {
                  e.preventDefault();
                  handleSelect(results[activeIndex]);
                }
                break;
              case "Escape":
                setShowDropdown(false);
                break;
              default:
                break;
            }
          }}
          className="outline-1 border border-gray-200 w-full rounded-md p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={showDropdown}
          aria-activedescendant={
            activeIndex >= 0 ? `typeahead-option-${activeIndex}` : undefined
          }
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700" />

        {searchTerm && showDropdown && (
          <ul role="listbox"
            className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-sm shadow-md mt-4 z-10 max-h-108 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-3 text-gray-500 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                      Searching...
                  </div>
            ) : results.length ? (
              results.map((result, index) => (
                <li key={index} id={`typeahead-option-${index}`}
                  ref={(el) => (optionRefs.current[index] = el)} role="option"
                  aria-selected={index === activeIndex} className={`py-2 px-6 cursor-pointer border-b border-gray-200 ${
                    index === activeIndex ? "bg-blue-50" : "hover:bg-gray-100"}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleSelect(result)}
                >
                  <SearchResult contact={result} />
                </li>
              ))
            ) : (
              <p className="p-3 text-gray-500">No results found.</p>
            )}
          </ul>
        )}
      </div>
      
      <ViewContactCard
        open={modalOpen}
        onOpenChange={setModalOpen}
        contact={selectedContact}
      />
    </>
  )
}

export default SearchContacts;