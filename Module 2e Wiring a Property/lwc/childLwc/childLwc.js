import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';

export default class ChildLwc extends LightningElement {
	@api recordId;
	
	/*
		when wiring a property: The property is assigned a default value after component 
		construction and before any other lifecycle event.   

		when wiring a function: The function is invoked whenever a value is available, 
		which can be before or after the component is connected or rendered.
	*/
	@wire(getRecord, { recordId: '$recordId', fields: [CONTACT_EMAIL_FIELD] })
	record;
	
	get email() {
		let output = "Not loaded yet...";
		if (this.record.data) {
			output = this.record.data.fields.Email.value;
		}
		return output;
	}
}