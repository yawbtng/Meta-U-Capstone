import {useEffect, useState} from 'react';
import ContactsTable from '../components//contacts-table-components/contacts-table';

const AllContacts = () => {
    const [contacts, setContacts] = useState([])

    return(
        <div>

            <h1>All Contacts</h1>
            <ContactsTable />


        </div>
    )

}

export default AllContacts;
