import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
//import CONTACT_TEXT_FIELD from '@salesforce/schema/Contact.Text_Field__c';

export default class ChildLwc extends LightningElement {
	@api recordId;
	@track record;
	@track error;

	/*
		when wiring a property: The property is assigned a default value after component 
		construction and before any other lifecycle event.   

		when wiring a function: The function is invoked whenever a value is available,  
		which can be before or after the component is connected or rendered. 
	*/
	//@wire(getRecord, { recordId: "$recordId", fields: [{fieldApiName: "Email", objectApiName: "Contact"},
	//                                                   {fieldApiName: "Text_Field__c", objectApiName: "Contact"}] })
	//@wire(getRecord, { recordId: "$recordId", fields: [{fieldApiName: "Email", objectApiName: "Contact"}] })
	//@wire(getRecord, { recordId: '$recordId', fields: [CONTACT_EMAIL_FIELD, CONTACT_TEXT_FIELD] })
	@wire(getRecord, { recordId: "$recordId", fields: [CONTACT_EMAIL_FIELD] })
	wiredContact({ error, data }) {
		if (data) {
			this.record = data; 
			this.error = undefined;
		} else if (error) {
			this.record = undefined; 
			this.error = error;
		}
	}

	get email() {
		let output = "Not loaded yet...";
		if (this.record && this.record.fields) {
			output = this.record.fields.Email.value;
			//console.log('Record fields:' + this.record.fields);
			//let txt = this.record.fields.Text_Field__c.value;
			//console.log(txt);
		}
		return output;
	}

	/*
	@wire(getRecord, { recordId: '$recordId', fields: [CONTACT_EMAIL_FIELD] })
	record;
	
	get email() {
		let output = "Not loaded yet...";
		if (this.record.data) {
			output = this.record.data.fields.Email.value;
		}
		return output;
	}
	*/
}