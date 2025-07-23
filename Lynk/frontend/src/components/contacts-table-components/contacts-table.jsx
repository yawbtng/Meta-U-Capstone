import { useEffect, useState } from "react";
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

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto my-10">
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
