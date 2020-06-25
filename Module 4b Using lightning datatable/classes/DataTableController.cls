public with sharing class DataTableController {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts (Integer rowLimit, Integer rowOffset) {
        
        rowLimit = Integer.valueOf(rowLimit);  // Need to do this as it looks like Integers are not converted correctly
        rowOffset = Integer.valueOf(rowOffset);
        
        return [SELECT Id, FirstName, LastName, Email, Phone FROM Contact ORDER BY FirstName
                LIMIT :rowLimit OFFSET :rowOffset];
    }

    @AuraEnabled
    public static List<Contact> refreshContacts (Integer rowLimit) {
        
        rowLimit = Integer.valueOf(rowLimit);  // Need to do this as it looks like Integers are not converted correctly
        
        return [SELECT Id, FirstName, LastName, Email, Phone FROM Contact ORDER BY FirstName
                LIMIT :rowLimit];
    }    
    
    @AuraEnabled
    public static void updateContacts (List<Contact> contacts) {
        try {
            update contacts;
        }
        catch (Exception e) {
            throw new AuraHandledException('Update failed: ' + e);
        }           
    }
    
    @AuraEnabled(cacheable=true)
    public static Integer countContacts () {
        return [SELECT Count() FROM Contact];
    }
}