/**
 *  @file       CollectionsPage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  Initialize all stuff needed on the collections page.
 *	@class
 *  @extends LoggedInPage
 **/
var CollectionsPage = LoggedInPage.extend({
    _initializeModelManager: function(params) {
        return new CollectionsPageModelManager(params);
    }, 
    _initializeViews: function() {
        LoggedInPage.prototype._initializeViews.call(this);
        
        var modelManager = this.modelManager;
        
        /**
         *  Create "create/join collection panel"
         **/
        var createJoinCollectionPanel = new CreateJoinCollectionPanel({
            page: this, 
            el: $('#create_join_panel')
        });
        this.createJoinCollectionPanel = createJoinCollectionPanel;


        /**
         *  This panel will allow the user to manage the collections they are an 
         *  administrator of.
         **/
        var manageAdminCollectionsPanel = new ManageAdminCollectionsPanel({
            page: this,
            el: $('#manage_admin_collections_panel'),
            set: modelManager.userAdminCollections
        });
        this.manageAdminCollectionsPanel = manageAdminCollectionsPanel;

        /**
         *  This panel will allow the user to manage the collectionsuser they are a 
         *  member of (excluding the ones they are an administrator of)
         **/
        var manageMemberCollectionsPanel = new ManageMemberCollectionsPanel({
            page: this, 
            el: $('#manage_member_collections_panel'), 
            set: modelManager.userMemberCollections
        });
        this.manageMemberCollectionsPanel = manageMemberCollectionsPanel;

        /**
         *  This panel will allow the user to manage the join requests they have
         *  sent out.
         **/
        var manageRequestsPanel = new ManageRequestsPanel({
            page: this, 
            el: $('#manage_request_collections_panel'), 
            set: modelManager.userRequests
        });
        this.manageRequestsPanel = manageRequestsPanel;
        
    },
    
    /**
     *  When an administrator denies a join request.
     *
     *  @param  {Request}    req - The request object that the administrator is
     *  changing
     **/
    denyRequestWithConfirm: function(req) {
        /* Show a confirm dialog */
        com.concertsoundorganizer.notifier.confirm({
            title: "Are you sure?", 
            content: "Are you sure you want to deny "+req.get('user').get('username')+" from this collection?", 
            confirmCallback: function(req){
                return function() {
                    req.deny();
                }
            }(this)
        });
        
    }, 
});