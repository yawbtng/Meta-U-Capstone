import { useEffect, useState, useRef } from "react";
import { fetchContacts, deleteContact } from "../../../../backend/index.js";
import { UserAuth } from "../../context/AuthContext";
import { columns } from "./columns";
import DataTable from "./data-table";
import { toast } from "sonner";
import ViewContactCard from "../ViewContactCard";

const ContactsTable = () => {
  const { session } = UserAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const isMounted = useRef(true);

  const handleContactUpdated = (updated) => {
    setData((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    )
  }

  useEffect(() => {
    isMounted.current = true;
    if (!session) return;
    
    const fetchContactsData = async () => {
      if (!isMounted.current) return;
      setLoading(true);
      const result = await fetchContacts(session?.user?.id);
      if (!isMounted.current) return;
      if (!result.success) {
        console.error(result.error);
        toast.error("There was an error fetching the contacts");
      } else {
        setData(result.data);
      }
      setLoading(false);
    };
    
    fetchContactsData();
    return () => {
      isMounted.current = false;
    };
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

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto my-10 max-w-screen-2xl w-full">
      <DataTable 
        columns={columns(onDeleteContact, handleContactUpdated, handleViewContact)} 
        data={data}
        loading={loading}
      />
      <ViewContactCard
        open={modalOpen}
        onOpenChange={setModalOpen}
        contact={selectedContact}
      />
    </div>
  );
};

export default ContactsTable;
