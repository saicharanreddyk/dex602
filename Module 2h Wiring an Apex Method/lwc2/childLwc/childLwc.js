import { LightningElement, track, wire } from 'lwc';
import getContactsForAccount from '@salesforce/apex/ContactController.getContactsForAccount';
import getAccounts from '@salesforce/apex/ContactController.getAccounts';

export default class ChildLwc extends LightningElement {
	selectedAccountName = 'Acme Inc'; // Hard code the account name for now
	
	// Wire Apex method to a property
    @wire(getContactsForAccount, { accountName: '$selectedAccountName' })
    contacts;

	// The wired function populates these
	@track accounts;
	@track errormessage;

	// Wire Apex method to a function
    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        console.log('wiredAccount invoked');
        if (data) {
            console.log('wiredAccount invoked: has data');
            this.accounts = data;
            this.errormessage = undefined;
        } else if (error) {
            console.log('wiredAccount invoked: has error');
			this.errormessage = error.body.message;
			this.accounts = undefined;
        }
    }

    connectedCallback() {
		console.log('connectedCallback');
        if (this.contacts) {
            console.log('connectedCallback: Contacts defined');
        }
        if (this.accounts) {
            console.log('connectedCallback: Accounts defined');
        }
    }

    renderedCallback() {
		console.log('renderedCallback');
        if (this.contacts) {
            console.log('renderedCallback: Contacts defined');
        }
        if (this.accounts) {
            console.log('renderedCallback: Accounts defined');
        }
    }

    constructor() {
        super();
		console.log('constructor');
        if (this.contacts) {
            console.log('constructor: Contacts defined');
        }
        if (this.accounts) {
            console.log('constructor: Accounts defined');
        }
    }    
}