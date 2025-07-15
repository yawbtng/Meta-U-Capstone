import { useEffect, useState, useCallback } from "react";
import { fetchContacts, deleteContact } from "../../../../backend/index.js";
import { UserAuth } from "../../context/AuthContext";
import { columns, Contact } from "./columns";
import { getDbColumnName } from "./columns";
import DataTable from "./data-table";
import { toast } from "sonner";

const ContactsTable = () => {
  const { session } = UserAuth();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState([]);

  const handleContactUpdated = (updated) => {
  setData((prev) =>
    prev.map((c) => (c.id === updated.id ? updated : c))
  )
}

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);






  useEffect(() => {

    if (!session) return;

    const fetchContactsData = async () => {
      const result = await fetchContacts(session?.user?.id, filters);

      if (!result.success) {
        console.error(result.error);
        toast.error("There was an error fetching the contacts");
      } else {
        setData(result.data);
      }
    };

    fetchContactsData();
  }, [session, filters])

  const onDeleteContact = async (id) => {

    const result = await deleteContact(id);

    if (!result.success) {
      toast.error("There was an error deleting this contact")
    } else {
      setData(prevData => prevData.filter(contact => contact.id !== id));
      toast.success("Contact successfully deleted ✅")
    }
  }


  return (
      <div className="mx-auto my-10 ">
        <DataTable columns={columns(onDeleteContact, handleContactUpdated)} 
        data={data} onFiltersChange={handleFiltersChange}/>
      </div>
  );
}

export default ContactsTable;
