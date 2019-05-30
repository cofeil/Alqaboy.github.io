
module.exports = {

 	start: function() {	
            var db = require("./database");
            var today = new Date().getTime();

            db.getAllCars().then(function (response) {
                if(response.length){
                    for(let i=0;i<response.length;i++){
                        db.getAllCereriByCarId(response[i].id).then(function (response2) {
                            if(response2.length){       
                                var statusMasina=1;                         
                                for(let i=0;i<response2.length;i++){
                                    if(new Date(response2[i].perioadaridicare).getTime() <= today && today <= new Date(response2[i].perioadapredare).getTime() && response2[i].status_id == 8 ){
                                        statusMasina =2;
                                    }
                                }
                                db.updateStatusMasina(statusMasina, response[i].id).then(function (response3) {
                                }).catch(function (err) {
                                    console.log(err);
                                });                                
                            }
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                }
            }).catch(function (err) {
                console.log(err);
            });
 	},

}
