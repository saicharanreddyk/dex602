<aura:application extends="force:slds">
    
	<!-- Enter a valid contact record ID -->
    <aura:attribute name="recordId" type="String" default="0030R00000wl5imQAA" />
    
    <lightning:card title="aura">
        
            <!-- LW Component -->
            <c:parentLwc recordId="{!v.recordId}" />            

    </lightning:card>
    
</aura:application>