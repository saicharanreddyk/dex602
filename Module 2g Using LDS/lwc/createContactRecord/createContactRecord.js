import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';

import CONTACT_OBJECT from '@salesforce/schema/Contact';
import CONTACT_FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';

export default class CreateContactRecord extends LightningElement {

    @track contactId;
    firstname;
    lastname;
    @track errormessage;

    handleChange(event) {
        if (event.target.name === 'firstname') {
            this.firstname = event.target.value;
        } else {
            this.lastname = event.target.value;
        }
    }

    createContactRecord() {
        let fields = {};
        fields[CONTACT_FIRSTNAME_FIELD.fieldApiName] = this.firstname;
        fields[CONTACT_LASTNAME_FIELD.fieldApiName] = this.lastname;
		let record = { apiName: CONTACT_OBJECT.objectApiName, fields };

		//let record = {
		//	apiName: "Contact",
		//	fields: {
		//		FirstName: this.firstname,
		//		LastName: this.lastname
		//	}
		//};

        createRecord(record)
            .then(Contact => {
                this.contactId = Contact.id;
                this.errormessage = '';
            })
            .catch(error => {
				this.errormessage = error.body.message;
                this.contactId = '';
            });
    }
}