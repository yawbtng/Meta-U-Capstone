import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../providers/supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import { columns, Contact } from "./columns";
import { getDbColumnName } from "./columns";
import DataTable from "./data-table";
import { toast } from "sonner";

const ContactsTable = () => {
  const { session } = UserAuth();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState([]);

  const handleFiltersChange = useCallback((newFilters) => {
    console.log("Filters changed:", newFilters);
    setFilters(newFilters);
  }, []);



  const applyFiltersToQuery = (query, filters) => {
    let filteredQuery = query;

    filters.forEach(filter => {
      if (!filter.column || !filter.condition || 
          (filter.condition !== 'is_empty' && filter.condition !== 'is_not_empty' && !filter.value)) {
        return;
      }

      const { column, condition, value } = filter;
      const dbColumn = getDbColumnName(column);

      const arrayColumns = ['relationship_type', 'tags'];
      const isArrayColumn = arrayColumns.includes(column);

      switch (condition) {
        case 'contains':
          if (isArrayColumn) {
            filteredQuery = filteredQuery.cs(dbColumn, [value]);
          } else {
            filteredQuery = filteredQuery.ilike(dbColumn, `%${value}%`);
          }
          break;
        case 'does_not_contain':
          if (isArrayColumn) {
            filteredQuery = filteredQuery.not(dbColumn, 'cs', [value]);
          } else {
            filteredQuery = filteredQuery.not(dbColumn, 'ilike', `%${value}%`);
          }
          break;
        case 'is':
          if (isArrayColumn) {
            filteredQuery = filteredQuery.eq(dbColumn, [value]);
          } else {
            filteredQuery = filteredQuery.eq(dbColumn, value);
          }
          break;
        case 'is_not':
          if (isArrayColumn) {
            filteredQuery = filteredQuery.neq(dbColumn, [value]);
          } else {
            filteredQuery = filteredQuery.neq(dbColumn, value);
          }
          break;
        case 'is_empty':
          if (isArrayColumn) {
            filteredQuery = filteredQuery.or(`${dbColumn}.is.null,${dbColumn}.eq.{}`);
          } else {
            filteredQuery = filteredQuery.or(`${dbColumn}.is.null,${dbColumn}.eq.`);
          }
          break;
        case 'is_not_empty':
          if (isArrayColumn) {
            filteredQuery = filteredQuery.not(dbColumn, 'is', null).neq(dbColumn, '{}');
          } else {
            filteredQuery = filteredQuery.not(dbColumn, 'is', null).neq(dbColumn, '');
          }
          break;
        default:
          console.warn(`Unknown filter condition: ${condition}`);
          break;
      }
    });

    return filteredQuery;
  };


  useEffect(() => {

    if (!session) return;

    const fetchContacts = async () => {
      let query = supabase
        .from("connections").select("*").eq("user_id", session?.user?.id);

      query = applyFiltersToQuery(query, filters);
      const { data, error } = await query;

      if (error) {
        console.error(error);
        toast.error("There was an error fetching the contacts");
      } else {
        setData(data);
        console.log(data);
      }
    };

    fetchContacts();
  }, [session, filters])

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
        <DataTable columns={columns(onDeleteContact)} 
        data={data} onFiltersChange={handleFiltersChange}/>
      </div>
  );
}

export default ContactsTable;
