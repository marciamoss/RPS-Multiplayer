$(document).ready(function() {  

    var players=[],player1result, player2result,finalResult=[];
    
    //function for the player to pick their answer
    function pickAnswer(idName,resultDB,player){
            $("#rock").on("click", function(event){
            var result=$(this).text();
            $(("#paper,#scissors")).off("click");
            $(idName).css("border-color", "black"); 
            $(idName).html(player+"<br>"+"Wins:0 Losses:0");
            database.ref(resultDB).set({
                result: result 
            });
        });
        $("#paper").on("click", function(event){
            var result=$(this).text();
            $(("#rock,#scissors")).off("click");
            $(idName).css("border-color", "black"); 
            $(idName).html(player+"<br>"+"Wins:0 Losses:0");
            database.ref(resultDB).set({
                result: result 
            });
        });
        $("#scissors").on("click", function(event){
            var result=$(this).text();
            $(("#rock,#paper")).off("click");
            $(idName).css("border-color", "black"); 
            $(idName).html(player+"<br>"+"Wins:0 Losses:0");
            database.ref(resultDB).set({
                result: result 
            });
        });
    }

    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyAD4164IZr1S0c1sAmOGnBwRvYvmBX9pd0",
    authDomain: "rpsmultiplayer-80b3d.firebaseapp.com",
    databaseURL: "https://rpsmultiplayer-80b3d.firebaseio.com",
    projectId: "rpsmultiplayer-80b3d",
    storageBucket: "rpsmultiplayer-80b3d.appspot.com",
    messagingSenderId: "1065739310721"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();
    
    //remove previous playe data info
    database.ref("/player1").remove();
    database.ref("/player1result").remove();
    database.ref("/player2").remove();
    database.ref("/player2result").remove();

    var connectionsRef = database.ref("/connections");

    var connectedRef = database.ref(".info/connected");

    // When the client's connection state changes...
    connectedRef.on("value", function(snap) {
        
        // If they are connected..
        if (snap.val()) {
    
        // Add user to the connections list.
        var con = connectionsRef.push(true);
    
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
        }
    });

   

    connectionsRef.on("value", function(snapshot) {
         
        $("#player1Game").html("Waiting for player1");
        $("#player2Game").html("Waiting for player2");

        players.push(snapshot.node_.children_.root_.key);
        
        //remove duplicates players
        players.sort(function(a, b){return a-b});
        uniqueplayers = players.filter(function(item, pos) {
            return players.indexOf(item) == pos;
        });
        
        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        
        if(snapshot.numChildren()<=2 && snapshot.numChildren()>0){
            var keys = Object.keys(snapshot);     
               
            $(":button").on("click", function(event){
                
                if (($(this).attr("id")=='start') ){
                    if(uniqueplayers.length==2 && snapshot.node_.children_.root_.key==uniqueplayers[0]){   
                        var player1=$("#player-name").val();
                        $("#greeting").html("Hi "+player1+" you are player1 <br>"+"It's Your Turn!!!");
                        $("#player1Game").html("<p>"+player1+"</p>"+"<div id='rock'>Rock</div><div id='paper'>Paper</div><div id='scissors'>Scissors</div>"+"<div id='resStat'>Wins:0 Losses:0</div>");
                        
                        pickAnswer(idName='#player1Game',resultDB="player1result",player=player1);
                        
                        database.ref("player1").set({
                            name: player1 
                        });
                    }
                    if(uniqueplayers.length==1 && snapshot.node_.children_.root_.key==uniqueplayers[0]){
                        var player2=$("#player-name").val();
                        $("#greeting").html("Hi "+player2+" you are player2 <br>");
                        database.ref("player2").set({
                            name: player2
                        });  
                    } 
                    database.ref("/player1").on("child_added", function(getplayer1) {
                        player1=getplayer1.val();
                        if(uniqueplayers.length==1 && snapshot.node_.children_.root_.key==uniqueplayers[0]){
                            $("#greeting").append("Waiting for "+player1+" to choose");
                            $("#player1Game").html(player1+"<br>"+"Wins:0 Losses:0");
                        }
                        $("#player1Game").css("border-color", "yellow"); 
                    }, function(errorObject) {
                        console.log("Errors handled: " + errorObject.code);
                    });
                    database.ref("/player2").on("child_added", function(getplayer2) {
                        player2=getplayer2.val();
                        if(uniqueplayers.length==2 && snapshot.node_.children_.root_.key==uniqueplayers[0]){   
                            $("#greeting").text("Waiting for "+player2+" to choose");
                        }
                        $("#player2Game").html(player2+"<br>"+"Wins:0 Losses:0");
                    }, function(errorObject) {
                        console.log("Errors handled: " + errorObject.code);
                    });
                    database.ref("/player1result").on("child_added", function(player1result) {
                        player1result=player1result.val();
                        finalResult.push(player1result);
                        if (player2==undefined){
                            player2='player2';
                        }
                        $("#player2Game").html(player2+"<br>"+"Wins:0 Losses:0");
                        if(uniqueplayers.length==1 && snapshot.node_.children_.root_.key==uniqueplayers[0]){
                            $("#greeting").html("Hi "+player2+" It's Your Turn!!!");
                            $("#player1Game").css("border-color", "black"); 
                            $("#player2Game").css("border-color", "yellow"); 
                            $("#player2Game").html("<p>"+player2+"</p>"+"<div id='rock'>Rock</div><div id='paper'>Paper</div><div id='scissors'>Scissors</div>"+"<div id='resStat'>Wins:0 Losses:0</div>");
                                                        
                            pickAnswer(idName='#player2Game',resultDB="player2result",player=player2);
                            
                        }
                        if(uniqueplayers.length==2 && snapshot.node_.children_.root_.key==uniqueplayers[0]){   
                            if (player2==undefined){
                                player2='player2';
                            }
                            $("#greeting").text("Waiting for "+player2+" to choose");
                            $("#player2Game").css("border-color", "yellow"); 
                        }
                    }, function(errorObject) {
                        console.log("Errors handled: " + errorObject.code);
                    });
                    database.ref("/player2result").on("child_added", function(player2result) {
                        $("#player2Game").css("border-color", "black"); 
                        player2result=player2result.val();
                        finalResult.push(player2result);

                        uniqueresult = finalResult.filter(function(item, pos) {
                            return finalResult.indexOf(item) == pos;
                        });

                        $("#player1Game").html(player1+"<br>"+uniqueresult[0]); 
                        if(uniqueresult.length==2){
                            $("#player2Game").html(player2+"<br>"+uniqueresult[1]);
                        }
                        if(uniqueresult.length==1){
                            $("#player2Game").html(player2+"<br>"+uniqueresult[0]);
                        }
                        
                        $("#greeting").text("Final Results!");
                        if(uniqueresult[0]=="Scissors"){
                            if(uniqueresult.length==1){
                                $("#gameResults").html("Its a Tie!!"); 
                            }else if(uniqueresult[1]=="Paper"){
                                $("#gameResults").html(player1+"<br>Wins!!"); 
                            }else if(uniqueresult[1]=="Rock"){
                                $("#gameResults").html(player2+"<br>Wins!!"); 
                            }
                        }else if(uniqueresult[0]=="Paper"){
                            if(uniqueresult[1]=="Scissors"){
                                $("#gameResults").html(player2+"<br>Wins!!");
                            }else if(uniqueresult.length==1){
                                $("#gameResults").html("Its a Tie!!"); 
                            }else if(uniqueresult[1]=="Rock"){
                                $("#gameResults").html(player1+"<br>Wins!!"); 
                            }
                        }else if(uniqueresult[0]=="Rock"){
                            if(uniqueresult[1]=="Scissors"){
                                $("#gameResults").html(player1+"<br>Wins!!"); 
                            }else if(uniqueresult[1]=="Paper"){
                                $("#gameResults").html(player2+"<br>Wins!!");
                            }else if(uniqueresult.length==1){
                                $("#gameResults").html("Its a Tie!!"); 
                            }
                        }
                    }, function(errorObject) {
                        console.log("Errors handled: " + errorObject.code);
                    });
                }  
                
                
            });
        }
        
    });
});