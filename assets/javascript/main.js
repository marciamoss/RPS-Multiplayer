$(document).ready(function() {  

    var players=[],player1result, player2result, player1, player2, player1W, player2W;
    
    //function for the player to pick their answer
    function pickAnswer(idName,idName2,resultDB,player){
            $("#rock").on("click", function(event){
            var result=$(this).text();
            $(("#paper,#scissors")).off("click");
            $(idName).css("border-color", "black"); 
            if(idName=='#player1Game'){
                $(idName2).css("border-color", "yellow"); 
                $("#greeting").html("Waiting for "+'player2'+" to choose");
            }
            if(idName=='#player2Game'){
                $("#greeting").html("Waiting for results");
            }
            $(idName).html(player+"<br>"+"Wins:0 Losses:0");
            
            database.ref(resultDB).set({
                result: result 
            });
        });
        $("#paper").on("click", function(event){
            var result=$(this).text();
            $(("#rock,#scissors")).off("click");
            $(idName).css("border-color", "black"); 
            if(idName=='#player1Game'){
                $(idName2).css("border-color", "yellow"); 
                $("#greeting").html("Waiting for "+'player2'+" to choose");
            }
            if(idName=='#player2Game'){
                $("#greeting").html("Waiting for results");
            }
            $(idName).html(player+"<br>"+"Wins:0 Losses:0");
            
            database.ref(resultDB).set({
                result: result 
            });
        });
        $("#scissors").on("click", function(event){
            var result=$(this).text();
            $(("#rock,#paper")).off("click");
            $(idName).css("border-color", "black"); 
            if(idName=='#player1Game'){
                $(idName2).css("border-color", "yellow"); 
                $("#greeting").html("Waiting for "+'player2'+" to choose");
            }
            if(idName=='#player2Game'){
                $("#greeting").html("Waiting for results");
            }
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
    database.ref("/latestplayerid").remove();
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

           
        database.ref("latestplayerid").set({
            id: uniqueplayers[0]
        });
 
        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        var keys = Object.keys(snapshot);     
            
        $(":button").on("click", function(event){
            if (($(this).attr("id")=='start') ){
                database.ref("/player1").once("value").then(function(getplayer1) {
                    var player1Exists = getplayer1.exists();
                    if (!player1Exists){
                        database.ref("/latestplayerid").on("child_added", function(playerid) {
                            var playerid=playerid.val();
                            if(uniqueplayers.length==1){     
                                player1=$("#player-name").val();
                                $("#greeting").html("Hi "+player1+" you are player1 <br>"+"It's Your Turn!!!");
                                $("#player1Game").css("border-color", "yellow"); 
                                $("#player1Game").html("<p>"+player1+"</p>"+"<div id='rock'>Rock</div><div id='paper'>Paper</div><div id='scissors'>Scissors</div>"+"<div id='resStat'>Wins:0 Losses:0</div>");
                                
                                pickAnswer(idName='#player1Game',idName2='#player2Game',resultDB="player1result",player=player1);
                                
                                database.ref("player1").set({
                                    name: player1 
                                });
                                database.ref("/player1result").on("child_added", function(getplayer1result) {
                                    player1result=getplayer1result.val();
                                    if (player1result != ""){
                                        if(uniqueplayers.length==1){
                                            $("#greeting").html("There is no player2, Try Again!");
                                            setTimeout(function(){ location.reload(); }, 3000);
                                        }
                                    }

                                });
                            }
                            else if(uniqueplayers.length==2){   
                                player1=$("#player-name").val();
                                $("#greeting").html("Hi "+player1+" you are player1 <br>"+"It's Your Turn!!!");
                                $("#player1Game").css("border-color", "yellow"); 
                                $("#player1Game").html("<p>"+player1+"</p>"+"<div id='rock'>Rock</div><div id='paper'>Paper</div><div id='scissors'>Scissors</div>"+"<div id='resStat'>Wins:0 Losses:0</div>");
                                
                                pickAnswer(idName='#player1Game',idName2='#player2Game',resultDB="player1result",player=player1);
                                
                                database.ref("player1").set({
                                    name: player1 
                                });
                            }
                        });
                    }
                    else{
                        database.ref("/player1").once("value").then(function(getplayer1) {
                            player1=getplayer1.val().name;
                            if(uniqueplayers.length==1){
                                player2=$("#player-name").val();
                                $("#greeting").html("Hi "+player2+" you are player2 <br>Waiting for "+player1+" to choose");
                                $("#player1Game").css("border-color", "yellow"); 
                                database.ref("player2").set({
                                    name: player2
                                });  
                                database.ref("/player1result").on("child_added", function(getplayer1result) {
                                    player1result=getplayer1result.val();
                                    if(uniqueplayers.length==1){
                                        $("#greeting").html("Hi "+player2+" It's Your Turn!!!");
                                        $("#player1Game").html("Wins:0 Losses:0");
                                        $("#player1Game").css("border-color", "black"); 
                                        $("#player2Game").css("border-color", "yellow"); 
                                        $("#player2Game").html("<p>"+player2+"</p>"+"<div id='rock'>Rock</div><div id='paper'>Paper</div><div id='scissors'>Scissors</div>"+"<div id='resStat'>Wins:0 Losses:0</div>");
                                                                    
                                        pickAnswer(idName='#player2Game',idName2='#player1Game',resultDB="player2result",player=player2);
                                        
                                    }
                                });
                            } 
                        });
                    }
                });
                database.ref("/player2result").on("child_added", function(getplayer2result) {
                    player2result=getplayer2result.val();
                    database.ref("/player1result").once("value").then(function(getplayer1result) {
                        player1resultExists = getplayer1result.exists();
                        player1result=getplayer1result.val().result;
                        if(player1resultExists){
                            $("#greeting").text("Final Results!");
                            if(uniqueplayers.length==2){
                                $("#player2Game").css("border-color", "black"); 
                            }
                            if(player1result=="Scissors"){
                                if(player2result=="Scissors"){
                                    player1W=0;player2W=0;
                                }else if(player2result=="Paper"){
                                    player1W=1;player2W=0;
                                }else if(player2result=="Rock"){
                                    player1W=0;player2W=1;
                                }
                            }else if(player1result=="Paper"){
                                if(player2result=="Scissors"){
                                    player1W=0;player2W=1;
                                }else if(player2result=="Paper"){
                                    player1W=0;player2W=0;
                                }else if(player2result=="Rock"){
                                    player1W=1;player2W=0;
                                }
                            }else if(player1result=="Rock"){
                                if(player2result=="Scissors"){
                                    player1W=1;player2W=0;
                                }else if(player2result=="Paper"){
                                    player1W=0;player2W=1;
                                }else if(player2result=="Rock"){
                                    player1W=0;player2W=0;
                                }
                            }
                            if(uniqueplayers.length==2){
                                database.ref("/player2").once("value").then(function(getplayer2) {
                                    player2=getplayer2.val().name;
                                    $("#greeting").text(player1+"'s Final Results!");
                                    if(player1W==1){
                                        $("#player1Game").css("border-color", "red"); 
                                        $("#player1Game").html(player1+" chose "+player1result); 
                                        $("#player2Game").html(player2+" chose "+player2result); 
                                        $("#gameResults").html(player1+"<br>Wins!!"); 
                                    }
                                    else if(player2W==1){
                                        $("#player2Game").css("border-color", "red"); 
                                        $("#player2Game").html(player2+" chose "+player2result); 
                                        $("#player1Game").html(player1+" chose "+player1result); 
                                        $("#gameResults").html(player2+"<br>Wins!!"); 
                                    }
                                    else if(player1W==0 && player2W==0){
                                        $("#gameResults").html("Its a Tie!!"); 
                                        $("#player2Game").html(player2+" chose "+player2result); 
                                        $("#player1Game").html(player1+" chose "+player1result); 
                                    }
                                });
                            }
                            if(uniqueplayers.length==1){
                                $("#greeting").text(player2+"'s Final Results!");
                                if(player1W==1){
                                    $("#player1Game").css("border-color", "red"); 
                                    $("#player1Game").html(player1+" chose "+player1result); 
                                    $("#player2Game").html(player2+" chose "+player2result); 
                                    $("#gameResults").html(player1+"<br>Wins!!"); 
                                }
                                else if(player2W==1){
                                    $("#player2Game").css("border-color", "red"); 
                                    $("#player2Game").html(player2+" chose "+player2result); 
                                    $("#player1Game").html(player1+" chose "+player1result); 
                                    $("#gameResults").html(player2+"<br>Wins!!"); 
                                }  
                                else if(player1W==0 && player2W==0){
                                    $("#gameResults").html("Its a Tie!!"); 
                                    $("#player2Game").html(player2+" chose "+player2result); 
                                    $("#player1Game").html(player1+" chose "+player1result); 
                                }
                            }                            
                        }
                    });
                });
            }  
        });
    });
});