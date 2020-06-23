import { LightningElement, api, track, wire } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';

import CONTACT_FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';

export default class UpdateContactRecord extends LightningElement {

    @api recordId;
    @track firstname;
    @track lastname;
    @track errormessage;

    handleChange(event) {
        if (event.target.name === 'recordid') {
            this.recordId = event.target.value;
        } else if (event.target.name === 'firstname') {
            this.firstname = event.target.value;
        } else {
            this.lastname = event.target.value;
        }
    }

    // Retrieve the record based on the input ID
    @wire(getRecord, { recordId: '$recordId', fields: [CONTACT_FIRSTNAME_FIELD, CONTACT_LASTNAME_FIELD] })
    wiredContact({ error, data}) {
        if (data) {
            this.firstname = data.fields.FirstName.value;
            this.lastname = data.fields.LastName.value;
            this.errormessage = undefined;
        } else if (error) {
            this.errormessage = error.body[0].message;
        }
    }

    // Update the record for the given ID
    updateContactRecord() {
        let record = {
            fields: {
                Id: this.recordId,
                FirstName: this.firstname,
                LastName: this.lastname
            },
        };

        updateRecord(record)
            .then(() => {
                this.errormessage = 'Record updated';
            })
            .catch(error => {
                this.errormessage = error.body.message;
            });
    }
}