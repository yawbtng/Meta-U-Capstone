import {useEffect, useState} from 'react';
import ContactsTable from '../components/contacts-table-components/contacts-table';

const AllContacts = () => {
    return(
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">All Contacts</h1>
                <p className="text-muted-foreground">
                    Manage and view all your professional connections in one place.
                </p>
            </div>
            <ContactsTable />
        </div>
    )
}

export default AllContacts;
