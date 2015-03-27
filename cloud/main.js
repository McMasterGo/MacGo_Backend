Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

//Get the number of of active tokens
Parse.Cloud.define("getActiveTokens", function(request, response) {
 
    //Query Tokens
    var query = new Parse.Query("Tokens");
 
    //Get column names that are active in "Tokens" with bool = true
    query.equalTo("active", true);
    query.find({
        success: function(results){
            var activeToken = results.length;
            response.success("There are currently, " +activeToken+ " active tokens.");
        },
 
        error: function() {
            response.error("There does not seem to be any active tokens.");
        }
 
    });
});
 
Parse.Cloud.job("setTokens", function(request, response) {

    Parse.Cloud.useMasterKey();
 	
	var Tokens = Parse.Object.extend("Tokens");
	var query = new Parse.Query(Tokens);
	query.equalTo("active", true);
	query.limit(1000);

	query.find({
	  success: function(results) {
		
		for (var i = 0;i<results.length;++i) {
                results[i].set("active", false);
                results[i].save();
        }
		
		response.success("Successfully updated" + results.length + " files");

	  },
	  error: function(error) {
		response.error("It does not work");
	  }
	});	
});

 
Parse.Cloud.define("getDrinks", function(request, response) {
  
	var Category = Parse.Object.extend("Category");
	
	var Item = Parse.Object.extend("Item");
	var query = new Parse.Query(Item);
		
	var post = new Category();
	post.id = "3OxSQLUGqC";
	
	query.equalTo("category", post);

	
	var total = new Parse.Query(Item);
	total.exists("category");

	total.find({
		success: function(totalresult) {
			query.find({
				success: function(queryresult) {
					response.success(queryresult.length/totalresult.length);
			   
				},
				error: function(error) {
					response.error("Error: " + error.code + " " + error.message);
				}
			}); 
		}, 
		
		error: function(error) {
			
			response.error("Error: " + error.code + " " + error.message);
		}
		
	}); 


});


Parse.Cloud.define("getCandy", function(request, response) {
	
	
	var Purchase = Parse.Object.extend("Purchase");
	var purchases = new Parse.Query(Purchase);
	
	purchases.equalTo("user", request.params.user);
	
	var PurchaseItem = Parse.Object.extend("PurchaseItem");
	var purchaseItem = new Parse.Query(PurchaseItem);
	
    purchaseItem.find({
        success: function(results){
            var activeToken = results.length;
            response.success("There are currently, " +activeToken+ " active tokens.");
        },
 
        error: function() {
            response.error("There does not seem to be any active tokens.");
        }
 
    }); 

	


});


Parse.Cloud.define("getFruits", function(request, response) {
  
	var Category = Parse.Object.extend("Category");
	
	var Item = Parse.Object.extend("Item");
	var query = new Parse.Query(Item);
		
	var post = new Category();
	post.id = "Y3ugfaVABS";
	
	query.equalTo("category", post);
	
	var total = new Parse.Query(Item);
	total.exists("category");

	total.find({
		success: function(totalresult) {
			query.find({
				success: function(queryresult) {
					response.success(queryresult.length/totalresult.length);
			   
				},
				error: function(error) {
					response.error("Error: " + error.code + " " + error.message);
				}
			}); 
		}, 
		
		error: function(error) {
			
			response.error("Error: " + error.code + " " + error.message);
		}
		
	}); 
 


});

Parse.Cloud.define("getFastFood", function(request, response) {
  
	var Category = Parse.Object.extend("Category");
	
	var Item = Parse.Object.extend("Item");
	var query = new Parse.Query(Item);
		
	var post = new Category();
	post.id = "mfBDpVPm5A";
	
	query.equalTo("category", post);
	
	var total = new Parse.Query(Item);
	total.exists("category");

	total.find({
		success: function(totalresult) {
			query.find({
				success: function(queryresult) {
					response.success(queryresult.length/totalresult.length);
			   
				},
				error: function(error) {
					response.error("Error: " + error.code + " " + error.message);
				}
			}); 
		}, 
		
		error: function(error) {
			
			response.error("Error: " + error.code + " " + error.message);
		}
	}); 

});


Parse.Cloud.job("testing", function(request, response) {
	
	Parse.Cloud.useMasterKey();
 	
	var Tokens = Parse.Object.extend("Tokens");
	var query = new Parse.Query(Tokens);

	query.lessThan("expiry", new Date ());
	query.limit(1000);
		
    query.find({
	  success: function(results) {
		
		for (var i = 0;i<results.length;++i) {
                results[i].set("active", false);
                results[i].save();
        }
		
		response.success("Successfully updated" + results.length + " files");

	  },
	  error: function(error) {
		response.error("It does not work");
	  }
	});	
	
});

