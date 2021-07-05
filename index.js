var express = require("express")
var app = express();
var http = require("http").createServer(app)
var mongodb = require("mongodb")
var mongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;



app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

http.listen(3000,function(){
    console.log("server started on localhost:3000...!!");

    mongoClient.connect("mongodb://localhost/27017",{
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, function(err,client){
        database = client.db("SouravTest")

       // this api is to find the vetenary clinic within 1 to 5 km range of location provided by user
    app.get("/fetch-clinics", function(req,res){
        db.vetenaryClinic.find(
            {
              location:
                { $near :
                   {
                     $geometry: { type: "Point",  coordinates: [ req.query.lat, req.query.long ] },
                     $minDistance: 1000,
                     $maxDistance: 5000
                   }
                }
            },function(err,clinics){
                if(err){
                    res.json({
                        status:false,
                        message:"Internal server error...!!"
                    })
                }else{
                    if(clinics===null){
                        res.json({
                            status:false,
                            message:"No clininc available sorry...!!"
                        })
                    }else{
                       res.json({
                        status:false,
                        message:"Clinics list...!!",
                        data:clinics,
                        count:clinics.length
                       })
                        
                    }
                }
            }
         )

            
        })

        app.get("/fetch-user-address", function(req,res){
            db.users.aggregate([{ "$match": { "city": "kolkata" }},
                {
                  $lookup:
                    {
                      from: "adress",
                      localField: "_id",// Object id of the user
                      foreignField: "user_id", // set ref id of user on address collcetion 
                      as: "user_address"
                    }
               }
             ],function(err,data){
                if(err){
                    res.json({
                        status:false,
                        message:"Internal server error...!!"
                    })
                }else{
                    if(data===null){
                        res.json({
                            status:false,
                            message:"No address found...!!"
                        })
                    }else{
                       res.json({
                        status:false,
                        message:"Users list...!!",
                        data:data,
                        count:data.length
                       })
                        
                    }
                }
            })
            })

       

        
    })
    
})