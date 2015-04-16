Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


//Creates token and saves them in database
Parse.Cloud.define("createTokens", function(request, response) {

var Tokens = Parse.Object.extend("Tokens");
var tokens = new Tokens();
 
var twoMinutesLater = new Date();
twoMinutesLater.setMinutes(twoMinutesLater.getMinutes() + 2);

tokens.set("active", true);
tokens.set("expiry", twoMinutesLater);

	tokens.save(null, {
	  success: function(tokens) {
	
		response.success('New Token created');
	  },
	  error: function(tokens, error) {
		//  if the save fails.
		
		response.error('Failed to create new object, with error code: ' + error.message);
	  }
	});

});


//Get the total number of of active tokens
Parse.Cloud.define("getActiveTokens", function(request, response) {
 
    //Query Tokens
    var query = new Parse.Query("Tokens");
	
	query.limit(1000);
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

//Checks all tokens to see if they are set to false, if so set them to true

Parse.Cloud.job("setTokens", function(request, response) {
    
	var Tokens = Parse.Object.extend("Tokens");
	var query = new Parse.Query(Tokens);
	query.limit(1000);
	
	query.equalTo("active", true);
	query.lessThan("expiry", new Date ());
	
    return query.find()
        .then(function(results) { // success
            var toSave = [];
            var promise = new Parse.Promise();
            for (var i = 0; i < results.length; i++) {
                var active = results[i].get("active");
                if (active == true ) {    
                    results[i].set("active", false);
                    toSave.push(results[i]);
                }
                if (toSave.length >= results.length) {
                    break;
                }
            }
            // use saveAll to save multiple object without bursting multiple request
            Parse.Object.saveAll(toSave, {
                useMasterKey: true,
                success: function(list) {
                    promise.resolve(list.length);
                },
                error: function() {
                    promise.reject();
                }
            });
            return promise;    
        }).then(function(length) { // success
            response.success("Test passed");
        }, function() { // error
            response.error("Test failed");
        });
});




//Destroys all tokens which are set to true
Parse.Cloud.define("destroyActiveTokens", function(request, response) {

    Parse.Cloud.useMasterKey();
 	
	var Tokens = Parse.Object.extend("Tokens");
	var query = new Parse.Query(Tokens);
	query.equalTo("active", true);
	query.limit(1000);

	query.find({
	  success: function(results) {
		
		for (var i = 0;i<results.length;++i) {
              
                results[i].destroy();
        }
				
		response.success("Successfully updated" + results.length + " files");

	  },
	  error: function(error) {
		response.error("It does not work");
	  }
	});	
});

Parse.Cloud.define("resetDate", function(request, response) {

});


Parse.Cloud.define("gettotalPurchases", function(request, response) {

	// Parse.User.current()
	var userId = request.params.userId;
	
	//Finds current user	
	var User = Parse.Object.extend("User");
	var user = new Parse.Query(User);
	user.equalTo("objectId", userId);
	
//	var resetDate = new Parse.Query(User);	
	
	//Finds all purchases that user has made after certain date
	var Purchase = Parse.Object.extend("Purchase");
	var purchases = new Parse.Query(Purchase);
	purchases.matchesQuery("user", user);
    //purchases.greaterThan ("createdAt", "2015-04-14T01:33:34.649Z");
	
	purchases.count({
	success: function(results) {
				
		response.success(results);
			
	},
	error: function(error) {
		response.error("");
	}
	});
	
});	


Parse.Cloud.define("getTotalCost", function(request, response) {
	
	var totalCost = 0;
	
	// Parse.User.current()
	var userId = request.params.userId;
	
	//Finds current user	
	var User = Parse.Object.extend("User");
	var user = new Parse.Query(User);
	user.equalTo("objectId", userId);
	
//	var resetDate = new Parse.Query(User);	
	
	//Finds all purchases that user has made after certain date
	var Purchase = Parse.Object.extend("Purchase");
	var purchases = new Parse.Query(Purchase);
	purchases.matchesQuery("user", user);
    //purchases.greaterThan ("createdAt", "2015-04-14T01:33:34.649Z");
	
	purchases.find({
	success: function(results) {
		for (var i = 0; i < results.length; ++i) {
			totalCost += results[i].get("totalCost");
		}
		
		response.success(totalCost);
			
	},
	error: function(error) {
		response.error("");
	}
	});	
});
	
Parse.Cloud.define("getStats", function(request, response) {
	
	var totalCost = 0;
	var CandyCost = 0;
	var FastFoodCost = 0; 
	var FruitsCost = 0;
	var BeverageCost = 0;
	var category; 	
	
	// Parse.User.current()
	var userId = request.params.userId;
	
	//Finds current user	
	var User = Parse.Object.extend("_User");
	var user = new Parse.Query(User);
	user.equalTo("objectId", userId);
	
	//Finds all purchases that user has made 
	var Purchase = Parse.Object.extend("Purchase");
	var purchases = new Parse.Query(Purchase);
	purchases.matchesQuery("user", user);

	//Matches purchases with Item
	var PurchaseItem  = Parse.Object.extend("PurchaseItem");
	var purchaseItem = new Parse.Query(PurchaseItem);
	var Itempurchase = new Parse.Query(PurchaseItem);
	
	purchaseItem.matchesQuery("purchase", purchases);
	purchaseItem.include('item');
	
	var items; 
	
	purchaseItem.find({
	success: function(itemPurchased) {
			
			for (var i = 0; i < itemPurchased.length; ++i) {
				items = itemPurchased[i].get("item");
				category = items.get("category");
				totalCost = totalCost + items.get("price"); 
				
				//candy
				if (category.id == "DvJkBBefcP"){
					CandyCost = CandyCost + items.get("price"); 
				} //Fast Food
				 else if (category.id == "mfBDpVPm5A") { 
				  FastFoodCost = FastFoodCost + items.get("price");
				} //Fruits
				 else if (category.id == "Y3ugfaVABS") {
					FruitsCost  = FruitsCost + items.get("price");
				} 
				 else {
				  BeverageCost = BeverageCost + items.get("price");
				}
			}
				
		
			response.success("Candy: " + CandyCost/totalCost + 
							 " Fast Food: " + FastFoodCost/totalCost +
							 " Fruits: " + FruitsCost/totalCost +
							 " Beverages: " +  BeverageCost/totalCost
							 );

	},
	error: function(error) {
		response.error("");
	}
	});	

		

});
 





Parse.Cloud.define('editUser', function(request, response) {
    var userId = request.params.userId,
        newBalance = request.params.balance;
 
    var User = Parse.Object.extend('_User'),
        user = new User({ objectId: userId });
 
    user.set('balance', newBalance);
 
    Parse.Cloud.useMasterKey();
    user.save().then(function(user) {
        response.success(user);
    }, function(error) {
        response.error(error)
    });
});




