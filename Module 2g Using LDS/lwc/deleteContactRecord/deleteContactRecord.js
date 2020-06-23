import { LightningElement, api, track } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';

export default class DeleteContactRecord extends LightningElement {

    @api recordId;
    @track errormessage;

    handleChange(event) {
        this.recordId = event.target.value;
    }

    // Delete the record for the given ID
    deleteContactRecord() {
        deleteRecord(this.recordId)
            .then(() => {
                this.errormessage = 'Record deleted';
            })
            .catch(error => {
                this.errormessage = error.body.message;
            });
    }
}