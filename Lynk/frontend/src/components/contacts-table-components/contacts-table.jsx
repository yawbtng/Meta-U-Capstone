import { useEffect, useState } from "react";
import { fetchContacts, deleteContact } from "../../../../backend/index.js";
import { UserAuth } from "../../context/AuthContext";
import { columns } from "./columns";
import DataTable from "./data-table";
import { toast } from "sonner";

const ContactsTable = () => {
  const { session } = UserAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleContactUpdated = (updated) => {
    setData((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    )
  }

  useEffect(() => {
    if (!session) return;
    
    const fetchContactsData = async () => {
      setLoading(true);
      const result = await fetchContacts(session?.user?.id);
      if (!result.success) {
        console.error(result.error);
        toast.error("There was an error fetching the contacts");
      } else {
        setData(result.data);
      }
      setLoading(false);
    };
    
    fetchContactsData();
  }, [session]); 

  const onDeleteContact = async (id) => {
    const result = await deleteContact(id, session?.user?.id);
    if (!result.success) {
      toast.error("There was an error deleting this contact")
    } else {
      setData(prevData => prevData.filter(contact => contact.id !== id));
      toast.success("Contact successfully deleted ✅")
    }
  }

  return (
    <div className="mx-auto my-10">
      <DataTable 
        columns={columns(onDeleteContact, handleContactUpdated)} 
        data={data}
        loading={loading}
      />
    </div>
  );
};

export default ContactsTable;
