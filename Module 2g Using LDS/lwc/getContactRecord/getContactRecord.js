import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

import CONTACT_FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';

export default class GetContactRecord extends LightningElement { 
    @api recordId;

    handleChange(event) {
        this.recordId = event.target.value;
    }

    @wire(getRecord, { recordId: '$recordId', fields: [CONTACT_FIRSTNAME_FIELD, CONTACT_LASTNAME_FIELD] })
    contact;

    get firstname() {
        return this.contact.data.fields.FirstName.value;
    }

    get lastname() {
        return this.contact.data.fields.LastName.value;
    }

    get errormessage() {
        return this.contact.error.body.message;
    }
}