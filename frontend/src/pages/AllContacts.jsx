import {useEffect, useState} from 'react';
import ContactsTable from '../components//contacts-table-components/contacts-table';

const AllContacts = () => {
    const [contacts, setContacts] = useState([])

    return(
        <>

            <h1>All Contacts</h1>
            <ContactsTable />


        </>
    )

}

export default AllContacts;
