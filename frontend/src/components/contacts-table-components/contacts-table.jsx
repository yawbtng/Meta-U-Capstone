import { useEffect, useState } from "react";
import { supabase } from "../../providers/supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import { columns, Contact } from "./columns";
import DataTable from "./data-table";

const ContactsTable = () => {
  const { session } = UserAuth();
  const [data, setData] = useState([]);
  console.log(data)


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

  return (
    <div className="mx-auto my-10 ">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default ContactsTable;
