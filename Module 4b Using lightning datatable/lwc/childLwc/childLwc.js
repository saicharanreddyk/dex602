import { LightningElement, api, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/DataTableController.getContacts';
import refreshContacts from '@salesforce/apex/DataTableController.refreshContacts';
import updateContacts from '@salesforce/apex/DataTableController.updateContacts';
import countContacts from '@salesforce/apex/DataTableController.countContacts';

export default class ChildLwc extends LightningElement {
	
	cols = [
		{label: 'Contact First Name', fieldName: 'FirstName', type: 'text', sortable: 'true', editable: 'true'},
		{label: 'Contact Last Name', fieldName: 'LastName', type: 'text', sortable: 'true', editable: 'true'},
		{label: 'Contact Email', fieldName: 'Email', type: 'email', editable: 'true'},
		{label: 'Contact Phone', fieldName: 'Phone', type: 'phone', editable: 'true'}
	];

	// Note: It's possible to add additional datatypes. See here:
	// https://salesforcesas.home.blog/2019/07/26/using-custom-lwc-components-in-lightning-datatable/

	@track totalrowcount = 0;
	@track currentrowcount = 0;
	@track rows = [];
	@track errorMessage;
	@track loadMoreStatus = 'Scroll to load more data';
	@track enableinfinitloading = true;
	rowLimit = 15;
	rowOffset = 0;
	@track errors;

	// Figure out how many contacts we have
	@wire(countContacts)
	wiredContactCount({ error, data }) {
		console.log('Counted total rows');
        if (data) {
			this.totalrowcount = data;
            this.errormessage = undefined;
        } else if (error) {
			this.totalrowcount = 0;
            this.errormessage = error.body[0].message;;
        }
    }

	// Get the contacts
	@wire(getContacts, { rowLimit: '$rowLimit', rowOffset: '$rowOffset' })
	wired_getContacts(result) {
		if (result.data) {
			console.log('getContacts: Found data');

			// If we already have some data add the new rows
			if ( this.rows.length>0 ) {
				const currentData = this.rows;
				const newData = currentData.concat(result.data);
				this.rows = newData;
				this.template.querySelector('lightning-datatable').isLoading = false;
				this.currentrowcount = this.rows.length;
				
				// Tell the user we are at the end and stop the infinite loading
				if (this.rows.length >= this.totalrowcount) {
					this.loadMoreStatus = 'No more data to load';
					this.enableinfinitloading = false;
				}
			// First page
			} else {
				this.rows = result.data;
				this.currentrowcount = this.rows.length;
			}
		} else if (result.error) {
			this.errorMessage = result.error.body[0].message;
			this.template.querySelector('lightning-datatable').isLoading = false;
		}
	}

	// Refresh current list of contacts
	refresh() {
		// We need to start from the beginning and re-fetch all current rows
		refreshContacts({rowLimit: this.currentrowcount})
		.then(result => {
			this.rows = result;
			this.errormessage = undefined;
		})
		.catch(error => {
			this.errormessage = error.body.message;
		})
	}
	
	// The onloadmore event handler
	loadMoreData(event) {

		// Show the spinner and increment the offset
		console.log('loadMoreData');
		event.target.isLoading = true;
		this.rowOffset = this.rowOffset + this.rowLimit;
	}

	// The onsort event handler
	updateColumnSorting(event) {
		let fieldName = event.detail.fieldName;
		let sortDirection = event.detail.sortDirection;
		
		// Assign the latest attribute with the sorted column fieldName and sorted direction
		this.template.querySelector('lightning-datatable').sortedBy = fieldName;
		this.template.querySelector('lightning-datatable').sortedDirection = sortDirection;

		// Sort the rows
		this.sortData(fieldName, sortDirection);
	}

	sortData(fieldName, sortDirection){
		let data = JSON.parse(JSON.stringify(this.rows));
		
		// Function to return the value stored in the field
        let key = (a) => a[fieldName]; 
        let reverse = sortDirection === 'asc' ? 1: -1;
        data.sort((a,b) => {
            let valueA = key(a) ? key(a).toLowerCase() : '';
            let valueB = key(b) ? key(b).toLowerCase() : '';
            return reverse * ((valueA > valueB) - (valueB > valueA));
        });

        // Set sorted data
        this.rows = data;
	}
	
	// The onrowselection event handler
	getSelectedNames(event) {
		let numSelected = event.detail.selectedRows.length;
		let selectedRows = event.detail.selectedRows;

        // Display that fieldName of the selected rows
        let names = [];
        selectedRows.forEach(r => {
            names.push(r.FirstName + ' ' + r.LastName);
        });

        alert("You have selected a total of " + numSelected + " rows: " + names);
	}
	
	// The onsave event handler
	handleSaveEdits(event) {
		updateContacts({ contacts: event.detail.draftValues })
		.then( () => {
			this.errorMessage = undefined;
			this.template.querySelector('lightning-datatable').draftValues = undefined;
			this.refresh();
		})
		.catch(error => {
			this.errorMessage = error.body.message;
		})
	}
}