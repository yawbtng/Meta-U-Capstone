import { useEffect, useState , useContext} from "react";
import { supabase } from "../../providers/supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import { columns, Contact } from "./columns";
import DataTable from "./data-table";
import { toast } from "sonner";

const ContactsTable = () => {
  const { session } = UserAuth();
  const [data, setData] = useState([]);


  useEffect(() => {

    if (!session) return;

    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from("connections")
        .select("*")
        .eq("user_id", session?.user?.id);

      if (error) console.error(error);
      else setData(data);
    };

    fetchContacts();
  }, [session])

  const onDeleteContact = (id) => {
    console.log(id)

    const deleteContact = async (id) => {
      const {data, error} = await supabase.from("connections").delete().eq("id", id)

      if (error) {
        toast.error("There was an error deleting this contact")
      } else {
        setData(prevData => prevData.filter(contact => contact.id !== id));
        toast.success("Contact successfully deleted ✅")
        
      }
    }
    
    deleteContact(id)
  }


  return (
      <div className="mx-auto my-10 ">
        <DataTable columns={columns(onDeleteContact)} data={data}/>
      </div>
  );
}

export default ContactsTable;
