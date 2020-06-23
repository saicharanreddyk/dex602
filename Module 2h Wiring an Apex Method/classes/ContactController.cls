public with sharing class ContactController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        List<Account> accounts = new List<Account>();
        try {
            accounts = [SELECT Id, Name, Type FROM Account WITH SECURITY_ENFORCED ORDER BY Name ASC];
        }
        catch (QueryException e) {
            throw new SecurityException('You don\'t have access to all the fields required');
        }
        return accounts;
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String accountId) {
        List<Contact> contacts = new List<Contact>();

        String query = 'SELECT Id, FirstName, LastName, Email FROM Contact ';

        If (accountId != '') {
            query = query + 'WHERE AccountId = :accountId ';
        }

        query = query + 'WITH SECURITY_ENFORCED ORDER BY Name ASC';

        try {
            contacts = database.query(query);
        }
        catch (QueryException e) {
            throw new SecurityException('You don\'t have access to all the fields required');
        }

        return contacts;
    }

	@AuraEnabled(cacheable=true)
    public static List<Contact> getContactsForAccount(String accountName) {
		List<Contact> contacts = new List<Contact>();

		try {
			contacts = [SELECT Id, FirstName, LastName, Email FROM Contact 
			            WHERE Account.Name = :accountName WITH SECURITY_ENFORCED ORDER BY Name ASC];
		}
		catch (QueryException e) {
			throw new SecurityException('You don\'t have access to all the fields required');
		}

		return contacts;
    }
}