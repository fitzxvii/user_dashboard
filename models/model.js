const config = require('../config.js');

class MVC_model {
    constructor() {
        this.isConnected = false;
    }

    static async executeQuery(query) {
        if(this.isConnected == false){
            return new Promise(function(resolve, reject){
                config.db_connect.on('error', function(err) {
                    resolve(this.handleConnection(query, err));
                });
    
                config.db_connect.connect(function(err){
                    resolve(this.handleConnection(query, err));
                });
            });
    
        }else{
            return this.execute(query);
        }
    }

    static async execute(query) {
        return new Promise(function(resolve, reject){
            config.db_connect.query(query, function (err, result) {
                if(err) {
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });    
    }

    static async handleConnection(query, err, limit = 1) {
        if(err) {
            this.isConnected = false;
    
            if(limit <= 10) {
                setTimeout(function(){
                    console.log("Reconnecting... Attempt #" + limit);
                    this.handleConnection(query, err, limit+1);
                }, 1500);
            } else {
                return new Promise(function(resolve, reject){
                    reject(err);
                });		            
            }
        } else {
            this.isConnected = true;
            return this.execute(query);
        }
    }
}


module.exports = MVC_model;