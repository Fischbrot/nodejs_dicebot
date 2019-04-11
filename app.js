//-------------------------------------
const colors = require('colors');
colors.setTheme({
    info: 'yellow',
    input: 'blue',
    prompt: 'white',
    error: 'red'
});
//require('log-timestamp');
var request = require('request');
const express = require('express');
const app = express();
const querystring = require('querystring');                                                                                                                                                                                                
const https = require('https');
var HttpsProxyAgent = require('https-proxy-agent');
var proxyChecker = require('proxy-checker');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'dicebot',
    multipleStatements: true
});
                //PACKAGES
//-------------------------------------


//-------------------------------------
//
//  DATABASE
//
//-------------------------------------
    function mysql_query(sql_query) {
        let select = sql_query;
        var query = db.query(select, function(err, rows, fields) {
            if (err) {
                console.error(err);
            }
        });
    }

    function async_mysql_query(sql_query) {
        return new Promise(function(resolve, reject) {
            let select = sql_query;
            var query = db.query(select, function(err, rows, fields) {
                if (err) {
                    console.error(err);
                }

                if (rows != undefined) {
                    resolve(rows);
                } else {
                    reject();
                }
            });
        })
    }
//-------------------------------------
//
//  - DATABASE -
//
//-------------------------------------


//-------------------------------------
//
//  UTILITIES 
//
//-------------------------------------
    function searchArray(value, arr, identifier){
        let iter = 0;

        return new Promise(function(resolve, reject) {
            
            var found = arr.find(function(element) {
                if(element[identifier] == value) {
                    resolve(element); 
                } else {
                    iter++;
                    if(iter >= arr.length) {
                        reject("NO_RESULT");
                    }
                }
            });
        })
    }
//-------------------------------------
//
// - UTILITIES -
//
//-------------------------------------


//-------------------------------------
//
//  REQUESTS
//
//-------------------------------------
    async function sendPost(request, proxy) {
        console.log("SENDING POST!")
        return new Promise(function(resolve, reject) {

            let postData = querystring.stringify(request);
            console.log(postData);

            var agent = new HttpsProxyAgent("http://" + proxy.host + ":" + proxy.port + "");

            let options = {
                hostname: 'www.999dice.com',
                port: 443,
                path: '/api/web.aspx',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': postData.length,
                    'X-Forwaded-Proto': 'https'
                },
                agent: agent,
                timeout: 5000,
                followRedirect: true,
                maxRedirects: 10
            };

            let req = https.request(options, (res) => {
               //console.log('statusCode:', res.statusCode);
               //console.log('headers:', res.headers);
               //console.log(colors.info(res));

                res.on('data', (d) => {
                    //console.log(colors.input(d));
                    var res_json = JSON.parse(d);
                    res_json.proxyID = proxy.proxyID;
                    resolve(res_json);
                });
            });

            req.on('error', (e) => {
            	console.log(e);
                reject(e);
            });

            req.write(postData);
            req.end();
        })
    }
//-------------------------------------
//
//  - REQUESTS -
//
//-------------------------------------

//-------------------------------------
//
//  PROXY - FUNCTIONS
//
//-------------------------------------
    function checkProxies() {
        mysql_query("TRUNCATE TABLE proxy");
        proxyChecker.checkProxiesFromFile(
            'proxies.txt',
            {
                url: 'https://999dice.com/',
            },
            function(host, port, ok, statusCode, err) {

                console.log(host + ':' + port + ' => ' + ok + " | " + statusCode)
                console.log(colors.error(err));
                if (ok == true) {
                    mysql_query("INSERT INTO proxy(host, port) VALUES('" + host + "', '" + port + "')");
                };
            }
        );
    }
    //checkProxies();

    let hosts = [];
    function checkProxy(host, port, options) {
        return new Promise(function(resolve, reject) {
            var proxyRequest = request.defaults({
                proxy: 'http://' + host + ':' + port
            });
            proxyRequest('https://999dice.com', function(err, res) {
                var testText = 'content="Yelp"';
                //console.log(colors.info(res));
                if( err ) {
                    console.log(colors.info("REJECT ERROR!"));
                    reject(err)
                } else if( res.statusCode != 200 ) {
                    console.log(colors.info("REJECT 200!"));
                    reject(res.statusCode);
                } else {
                    let data = {
                        host: host,
                        port: port,
                        bool: true
                    }
                    console.log(data + "=> ok");
                    resolve(data);
                }
            });
        })
    }

    function getProxy() {
        return new Promise(function(resolve, reject) {
            async_mysql_query("SELECT * FROM proxy ORDER BY RAND() LIMIT 1;")
                .then(rows => {
                    rows.forEach(function(row) {
                        let proxy = {
                            id: row.proxyID,
                            host: row.host,
                            port: row.port
                        }
                        console.log("CHECKING PROXY");
                        checkProxy(proxy.host, proxy.port)
                            .then(data => {
                                //mysql_query("UPDATE proxy SET inUse='1' WHERE proxyID='" + proxy.id + "';");
                                //console.log("resolve: " + data.host + ":" + data.port);
                                resolve(data);
                            })
                            .catch(err => {
                                mysql_query("DELETE FROM proxy WHERE proxyID='" + proxy.id + "';");
                                console.log("DELETE FROM proxy WHERE proxyID='" + proxy.id + "';");
                                reject(err);
                            })
                    })
                })
        })

    }
//-------------------------------------
//
//  - PROXY - FUNCTIONS -
//
//-------------------------------------

//-------------------------------------
//
//  LOGIN - FUNCTIONS
//
//-------------------------------------
    async function loginBotTimeout(bot) {
        return setTimeout(() => { loginBot(bot) }, 1000);   
    }


    let bot_sessions = [];
    var timer_bots = [];
    var bot_count;
    var bots_logged_in = false;
    function loginAllBots() {
        async_mysql_query("SELECT botID FROM bot_accounts;")
            .then(rows => {
                bot_count = rows.length;
                rows.forEach(function(row) {

                    bot_count = rows.length;
                    loginBot(row.botID);

                })
            }).catch(err => {
                console.log(err);
            })
    }
    loginAllBots();
    

    async function setConnTimeout(botID) {
        //clearTimeout(timer_bots[botID]);
        //timer_bots[botID] = setTimeout(() => { loginBot(botID) }, 10000);
    }

    let posts_send = [];
    var i_bots = 0;
    function loginBot(botID) {
        if (bots_logged_in != true) {
            console.log(colors.info("LOGGING IN BOT: " + botID));
            async_mysql_query("SELECT * FROM bot_accounts WHERE botID='" + botID + "';")
            .then(rows => {
                let row = rows[0];
                row.sent = false;

                console.log("TRYING REQUEST!");
                getProxy()
                    .then(hosts => {
                        clearTimeout(timer_bots[botID]);
                        setConnTimeout(botID);

                        sendLoginPost();

                        let retry = 0;

                        function sendLoginPost() {
                            console.log(colors.input({row},{host: hosts.host, port: hosts.port}));
                            if (row.sent != true) {
                                sendPost({
                                a: 'Login',
                                Key: row.api,
                                Username: row.user,
                                Password: row.password
                                },{host: hosts.host, port: hosts.port})
                                .then(result => {
                                    if (result.LoginInvalid == 1) {
                                        retry++;
                                        if (retry >= 5) {
                                            console.log("GIVING UP RETRYING");
                                            loginBot(botID);
                                        }
                                        console.log("LOGIN INVALID RETRYING...")
                                        sendLoginPost();
                                    } else {
                                        let data = {
                                            SessionCookie: result.SessionCookie,
                                            BetCount: result.BetCount,
                                            BetPayIn: result.BetPayIn,
                                            BetPayOut: result.BetPayOut,
                                            BetWinCount: result.BetWinCount,
                                            ClientSeed: result.ClientSeed,
                                            Key: row.api,
                                            Username: row.user,
                                            Password: row.password,
                                            botID: botID
                                        }
                                        

                                        clearTimeout(timer_bots[botID]);

                                        i_bots++;
                                        console.log("BOT EINGELOGGT! - " + data.Username);
                                        bot_sessions.push(data);
                                        botBet(botID);
                                        

                                        if (i_bots >= bot_count) {
                                            console.log(colors.info("______ALLE BOTS EINGELOGGT______"));
                                            console.log(colors.info(bot_sessions));
                                            console.log(colors.info("_-____ALLE BOTS EINGELOGGT____-_"));
                                            bots_logged_in = true;
                                        }
                                            
                                    }
                                })
                                .catch(err => {
                                    console.error("352:" + colors.error(err));
                                    clearTimeout(timer_bots[botID]);
                                    loginBot(botID)
                                })
                            } else {
                                row.sent = true;
                            }
                        }
                    }).catch(err => {
                        clearTimeout(timer_bots[botID]);


                        console.log(colors.info(botID + " -> resetTimer()"));
                        console.log(colors.error("getSingleWorkingProxy(): "));
                        console.error(colors.error(err));
                        loginBot(botID)
                    });

                clearTimeout(timer_bots[botID]);
                setConnTimeout(botID);

                console.log(colors.info("GETTING PROXY"));
            })
        }
    }
//-------------------------------------
//
//  - LOGIN - FUNCTIONS -
//
//-------------------------------------



//-------------------------------------
//
//  BETTING - FUNCTIONS
//
//-------------------------------------

function botBet(botID, oldProxy) {
	let sql_query = "SELECT bot_state.*, strategy.* from bot_state RIGHT JOIN strategy on bot_state.botID = strategy.botID WHERE bot_state.botID='" + botID + "';";
	async_mysql_query(sql_query)
		.then(data => {
			data = data[0];
        	let strat = {
				high_number: 999999,
				low_number: data.chance,
				basebet: data.basebet,
				multiplier: data.multiply,
				round: data.round,
				lost: data.lost,
				lost_depth: data.lost_depth
        	}

        	parseStrat(strat);
        	function parseStrat(strat) {
        		if (lost == 1) {

        		} else {

        		}
        	}

        	if (oldProxy.host == null || oldProxy.host == undefined) {
        		getBetProxy();
        	} else {

        	}


        	function getBetProxy() {
                getProxy()
                    .then(hosts => {
		            	
                    })
                    .catch(err => {
                    	console.error(colors.error(err));
                    	sendBetRequest();
                    })
        	}

        	function getBotStat(botID)

            function sendBetRequest() {
				searchArray(botID, bot_sessions, "botID")
					.then(arr => {

					})
					.catch(err => {
						console.error(colors.error(err));
						loginBot(botID);
					})
            }

            function sendBetRequest() {
		        sendPost({
		        a: 'PlaceBet',
		        s: arr.SessionCookie,
		        PayIn: strat.basebet,
		        Low: strat.low_number,
		        High: strat.high_number,
		        ClientSeed: arr.ClientSeed,
		        Currency: 'doge',
		        ProtocolVersion: 2
		        },{host: hosts.host, port: hosts.port})
		        .then(result => {
		        	async_mysql_query(sql_query)
		        		.then(state => {
		        			console.log(state);
		        			parseStrat(strat);
		        		})
		        		.catch(err => {
		        			console.log(err);
		        		})
		        })
		        .catch(err => {
		            console.error("sendBetRequest():" + colors.error(err));
		        })
            }

		})
		.catch(err => {
			console.log(colors.error(err));
		})
} 

//-------------------------------------
//
//  - BETTING - FUNCTIONS -
//
//-------------------------------------