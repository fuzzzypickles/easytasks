 document.addEventListener("DOMContentLoaded", function() {
 	console.log("DOM fully loaded and parsed");

 	// $("#task-content").html("Hello!<br/>");
 	StorageArea = chrome.storage.sync;
 	StorageArea.getBytesInUse(null, (bytes) => {
        if (bytes === 0) {
            console.log("There's no max key being stored");
           	$("#task-content").hide();
        } else {
            // Then see if we've added anything so far
            StorageArea.get("maxKey", (obj) => {
                maxKeyInt = parseInt(obj["maxKey"]);
                if (maxKeyInt === 0) {
                    console.log("Need to add some stuff first " +
                                "(the key is still 0)");
           			$("#task-content").hide();
                }
                else {
                	//get the recently added task
                    // var currentKeyStr = "maxKey";
                    // StorageArea.set({"maxKey": maxKey});
                    maxKeystr = maxKeyInt.toString();
                    StorageArea.get(maxKeystr, obj => displayTask(obj[maxKeystr]));
                }
            });
        }
    })
 });

// Bottom commented code doesn't work because element doesn't exist when your jquery is executing.
// $("#task-content").html("<span>Hello!</span>");

function displayTask(task) {
    $("#task-content").html("<span>"+task.content+"</span><br/>");
};

function removeKey() {
    StorageArea = chrome.storage.sync;

    // the max key with something stored there
    StorageArea.get("maxKey", (obj) => {
        // keys must be stored as strings
        var maxKeyStr = obj["maxKey"];
        var maxKeyInt = parseInt(maxKeyStr);
        // When there's only one thing stored, there's nothing else to put in
        // that slot, so skip this part and just delete it.
        if (maxKeyInt > 1) {
            // the key of the object we want to delete
            StorageArea.get("currentKey", (currentKeyObj) => {
                var currentKeyStr = currentKeyObj["currentKey"];
                // Get the inspriation stored with the max key and move to
                // current position, overriding (and therefore deleting) the
                // current inspiration.
                StorageArea.get(maxKeyStr, (maxInspObj) => {
                    var replacement = {};
                    replacement[currentKeyStr] = maxInspObj[maxKeyStr];
                    StorageArea.set(replacement);
                });
            });            
        }

        StorageArea.remove(maxKeyStr);
        
        // decrement the key so we can't pick it anymore.
        var newMaxKeyInt = parseInt(maxKeyStr) - 1;
        StorageArea.set({"maxKey": newMaxKeyInt.toString()});
        location.reload();
    });
}