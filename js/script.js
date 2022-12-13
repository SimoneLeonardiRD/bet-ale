let settings;

$(document).ready(function () {

    //Inject scripts, css and custom style
    //$('head').append('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">');
    //$('head').append('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script>');

    //console.log('<link rel="stylesheet" href="'+chrome.extension.getURL('css/jquery-ui.css')+'" crossorigin="anonymous">');
    $('head').append('<link rel="stylesheet" href="https://cdn.mignanoa.com/bet-bot-chrome-extension/jquery-ui.css"> crossorigin="anonymous"');
    $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>');

    $('head').append(`<style>
    .verdepastello{
        background-color: lightgreen;
    }

    .rossofisso{
        background-color: red;
    }
    
    .blink-red {
        animation: blinker-red 1s step-start infinite;
    }
    
    @keyframes blinker-red {
        50% {
            opacity: 80%;
            background-color: red;
        }
    }

    .blink-green {
        animation: blinker-green 1s step-start infinite;
    }

    @keyframes blinker-green {
        50% {
            opacity: 80%;
            background-color: lightgreen;
        }
    }
    
    .bet-bot-dialog {
        overflow-y: scroll;
    }

    .golColumn {
        background-color: #FCFC04;;
    }

    td {
        text-align: center;
        background-color: #FCFC04;
        font-weight: bold;
      }
    
    tr:nth-child(even) {background-color: #f2f2f2;}

    .yellowRow {
        background-color: #F0C33C;
    }

    #mytable.fullscreen{
        z-index: 9999; 
        width: 100%; 
        height: 100%; 
        position: fixed; 
        top: 0; 
        left: 0;
        background-color: #FFFFFF;
        overflow:auto; 
     }
    
    table { border-collapse: collapse; }
    tr { border: none; }
          
    </style>`);

    /**
     * Nella pagina pricipale la classe che identifica le partite è  $(".ovm-FixtureDetailsTwoWay_TeamsWrapper")
     * 
     * $(".me-MediaButtonLoader")[0].click() apre lo score sulla destra
     * $(".lv-ButtonBar_MatchLiveIcon").click() nel caso incui l'incona appena schiacciata sia un video, apre le statistiche live
     * 
     * 
     * $(".hm-MainHeaderCentreWide")[0].children[1].click() click sul pulsante "LIVE"
     */

    var vueApp = null;


    //Open Dialog
    setTimeout(() => {
        console.log("Appending");

        $('body').prepend(`<div id="bet-bot-dialog" title="Bet Bot"> 
                                <details>
                                    <summary>Leghe escluse</summary>
                                        <div v-for="excludedLeagueName in leagueExclusions">
                                            <button v-on:click="removeExclusion(excludedLeagueName)">Mostra</button> - {{excludedLeagueName}}
                                        </div>
                                </details>
                                <div style="overflow-x:auto; overflow-y:scroll;">
                                <table id="mytable" style="border: 1px solid black; width: 100%;">
                                        
                                    <tr id="header1">
                                        <th></th>
                                        <th></th>
                                        <th style="border-right: 5px solid black"></th>
                                        <th><input type="text" size="2" v-model="threshoolds.quota1" @input="dataChangeHandler"></input></th>
                                        <th><input type="text" size="2" v-model="threshoolds.quotaX" @input="dataChangeHandler"></input></th>
                                        <th style="border-right: 5px solid black"><input type="text" size="2" v-model="threshoolds.quota2" @input="dataChangeHandler"></input></th>

                                        <th><input type="text" size="2" v-model="threshoolds.golHome" @input="dataChangeHandler"></input></th>
                                        <th style="border-right: 5px solid black"><input type="text" size="2" v-model="threshoolds.golAway" @input="dataChangeHandler"></input></th>

                                        <th><input type="text" size="2" v-model="threshoolds.dAngoli" @input="dataChangeHandler"></input></th>
                                        <th><input type="text" size="2" v-model="threshoolds.attacchiPericolosi" @input="dataChangeHandler"></input></th>
                                        <th><input type="text" size="2" v-model="threshoolds.sTiP" @input="dataChangeHandler"></input></th>
                                        <th style="border-right: 5px solid black"><input type="text" size="2" v-model="threshoolds.possesso" @input="dataChangeHandler"></input></th>

                                        <th><input type="text" size="2" v-model="threshoolds.angoliHome" @input="dataChangeHandler"></input></th>
                                        <th><input type="text" size="2" v-model="threshoolds.angoliAway" @input="dataChangeHandler"></input></th>
                                        <th style="border-right: 5px solid black"><input type="text" size="2" v-model="threshoolds.sAngoli" @input="dataChangeHandler"></input></th>
                                   
                                    
                                        <th><input type="text" size="2" v-model="threshoolds.attacchiPericolosi2" @input="dataChangeHandler"></input></th>
                                        <th style="border-right: 5px solid black"><input type="text" size="2" v-model="threshoolds.attacchiPericolosiZeroZero" @input="dataChangeHandler"></input></th>
                                    
                                        <th><input type="text" size="2" v-model="threshoolds.TiPHome" @input="dataChangeHandler"></input></th>
                                        <th><input type="text" size="2" v-model="threshoolds.TiPAway" @input="dataChangeHandler"></input></th>
                                        <th><input type="text" size="2" v-model="threshoolds.TfPHome" @input="dataChangeHandler"></input></th>
                                        <th><input type="text" size="2" v-model="threshoolds.TfPAway" @input="dataChangeHandler"></input></th>
                                        <th><input type="text" size="2" v-model="threshoolds.sTfP" @input="dataChangeHandler"></input></th>
                                        
                                    </tr>
                                    <tr>
                                        <th title="Minuto della partita">Minuto</th>
                                        <th title="Squadra casa">Home</th>
                                        <th style="border-right: 5px solid black" title="Squadra fuori casa">Away</th>

                                        <th title="Quota 1">1</th>
                                        <th title="Quota X">X</th>
                                        <th style="border-right: 5px solid black" title="Quota 2">2</th>

                                        <th title="Gol squadra in casa">Gol Home</th>
                                        <th style="border-right: 5px solid black" title="Gol squadra fuori casa">Gol Away</th>

                                        <th title="Differenza Angoli">D. A.</th>
                                        <th title="Differenza attacchi pericolosi">D. Att. P.</th>
                                        <th title="Somma Tiri in Porta">S. TiP</th>
                                        <th style="border-right: 5px solid black" title="Differenza possesso palla">D. Pos.</th>
                                    
                                        <th title="Angoli squadra in casa">A. Home</th>
                                        <th title="Angoli squadra fuori casa">A. Away</th>
                                        <th style="border-right: 5px solid black" title="Somma Angoli">S. A.</th>                                    
                                    
                                        <th title="Differenza attacchi pericolosi 2">D. Att. P.2</th>
                                        <th style="border-right: 5px solid black" title="Differenza attacchi pericolosi Zero a Zero">D. Att. P. ZaZ</th>

                                        <th title="Tiri in porta Home">TiP Home</th>
                                        <th title="Tiri in porta Away">TiP Away</th>
                                        <th title="Tiri fuori porta Home">TfP Home</th>
                                        <th title="Tiri fuori porta Away">TfP Away</th>                                    
                                        <th title="Somma Tiri fuori Porta">S. TfP</th>
                                        <th><button v-on:click="hideHeader1()"><i class="fa fa-eye"></i></button></th>
                                    </tr>
                                <template v-for="(leagueGameList, leagueName, index) in leagueGames">
                                    <tr ><td colspan="22" style="background-color:lightblue"><b>{{leagueName}}<b></td><td><button v-on:click="addExclusion(leagueName)">Escludi</button></td></tr>
                                    <tr v-for="(game, index) in leagueGameList" v-bind:id="''+game.homeTeam[0]+game.homeTeam[1]+game.homeTeam[2]+game.awayTeam[0]+game.awayTeam[1]+game.awayTeam[2]+''">
                                        <td ><b>{{game.time}}</b></td>
                                        <td v-bind:class="(game.differenzaAttacchiPericolosi>threshoolds.attacchiPericolosi) ? 'verdepastello' : ''">{{game.homeTeam}} ({{game.postoHomeTeam}})</td>
                                        <td style="border-right: 5px solid black" v-bind:class="(game.differenzaAttacchiPericolosi>threshoolds.attacchiPericolosi) ? 'verdepastello' : ''">{{game.awayTeam}} ({{game.postoAwayTeam}})</td>

                                        <td v-bind:id="''+game.homeTeam[0]+game.homeTeam[1]+game.awayTeam[2]+game.awayTeam[0]+game.awayTeam[1]+game.homeTeam[1]+''" v-bind:class="(game.quota1<threshoolds.quota1) ? 'verdepastello' : ''"><a v-on:click="bloccaBianco(game.homeTeam[0]+game.homeTeam[1]+game.awayTeam[2]+game.awayTeam[0]+game.awayTeam[1]+game.homeTeam[1])"><b>{{game.quota1}}</b></a></td>
                                        <td v-bind:id="''+game.homeTeam[0]+game.awayTeam[1]+game.awayTeam[2]+game.homeTeam[0]+game.awayTeam[1]+game.homeTeam[2]+game.homeTeam[4]+''" v-bind:class="(game.quotaX>threshoolds.quotaX) ? 'rossofisso' : ''"><a v-on:click="bloccaBianco(game.homeTeam[0]+game.awayTeam[1]+game.awayTeam[2]+game.homeTeam[0]+game.awayTeam[1]+game.homeTeam[2]+game.homeTeam[4])"><b>{{game.quotaX}}</b></a></td>
                                        <td style="border-right: 5px solid black" v-bind:id="''+game.awayTeam[0]+game.awayTeam[1]+game.homeTeam[0]+game.homeTeam[1]+game.homeTeam[2]+game.awayTeam[2]+''" v-bind:class="(game.quota2<threshoolds.quota2) ? 'verdepastello' : ''"><a v-on:click="bloccaBianco(game.awayTeam[0]+game.awayTeam[1]+game.homeTeam[0]+game.homeTeam[1]+game.homeTeam[2]+game.awayTeam[2])"><b>{{game.quota2}}</b></a></td>

                                        <td v-if="game.thereIsData" v-bind:class="game.class_golHome" ><b>{{game.golHome}}</b></td>
                                        <td style="border-right: 5px solid black" v-if="game.thereIsData" v-bind:class="game.class_golAway"><b>{{game.golAway}}</b></td>
                                        
                                        <td v-bind:class="(game.differenzaAngoli>threshoolds.dAngoli) ? 'verdepastello' : ''"><b>{{game.differenzaAngoli}}</b></td>
                                        <td v-if="game.thereIsData" v-bind:class="(game.differenzaAttacchiPericolosi>threshoolds.attacchiPericolosi) ? 'verdepastello' : ''"><b>{{game.differenzaAttacchiPericolosi}}</b></td>
                                        <td v-if="game.thereIsData" v-bind:class="(game.sommaTiriInPorta>threshoolds.sTiP) ? 'verdepastello' : ''" style="background-color: #fcfc04"><b>{{game.sommaTiriInPorta}}</b></td>
                                        <td style="border-right: 5px solid black" v-if="game.thereIsData" v-bind:class="(game.differenzaPossesso>threshoolds.possesso) ? 'verdepastello' : ''"><b>{{game.differenzaPossesso}}</b></td>

                                        <td v-if="game.thereIsData" v-bind:class="(game.differenzaAngoli>threshoolds.dAngoli) ? 'verdepastello' : ''"><b>{{game.angoliHome}}</b></td>
                                        <td v-if="game.thereIsData" v-bind:class="(game.angoliAway>threshoolds.angoliAway) ? 'verdepastello' : ''"><b>{{game.angoliAway}}</b></td>
                                        <td style="border-right: 5px solid black" v-if="game.thereIsData" v-bind:class="(game.sommaAngoli>threshoolds.sAngoli) ? 'verdepastello' : ''"><b>{{game.sommaAngoli}}</b></td>
                                        
                                                                                
                                        <td v-if="game.thereIsData" v-bind:class="(game.differenzaAttacchiPericolosi>threshoolds.attacchiPericolosi2) ? 'verdepastello' : ''"><b>{{game.differenzaAttacchiPericolosi}}</b></td>
                                        <td style="border-right: 5px solid black" v-if="game.thereIsData" v-bind:class="(game.sommaGol == 0 && game.differenzaAttacchiPericolosi > threshoolds.attacchiPericolosiZeroZero) ? 'verdepastello' : ''"><b>{{game.differenzaAttacchiPericolosi}}</b></td>
                                        
                                        <td v-if="game.thereIsData" v-bind:class="(game.tiriInPortaHome>threshoolds.TiPHome) ? 'verdepastello' : ''"><b>{{game.tiriInPortaHome}}</b></td>
                                        <td v-if="game.thereIsData" v-bind:class="(game.tiriInPortaAway>threshoolds.TiPAway) ? 'verdepastello' : ''"><b>{{game.tiriInPortaAway}}</b></td>
                                        <td v-if="game.thereIsData" v-bind:class="(game.tiriFuoriPortaHome>threshoolds.TfPHome) ? 'verdepastello' : ''"><b>{{game.tiriFuoriPortaHome}}</b></td>
                                        <td v-if="game.thereIsData" v-bind:class="(game.tiriFuoriPortaAway>threshoolds.TfPAway) ? 'verdepastello' : ''"><b>{{game.tiriFuoriPortaAway}}</b></td>
                                        <td v-if="game.thereIsData" v-bind:class="(game.sommaTiriFuoriPorta>threshoolds.sTfP) ? 'verdepastello' : ''" style="background-color: #fcfc04"><b>{{game.sommaTiriFuoriPorta}}</b></td>

                                        <td v-if="!game.thereIsData" colspan="13">Dati non presenti</td>
                                        <td><input type="checkbox" v-on:click="barraLinea(game.homeTeam[0]+game.homeTeam[1]+game.homeTeam[2]+game.awayTeam[0]+game.awayTeam[1]+game.awayTeam[2], $event)"></input></td>
                                    </tr>
                                </template>
                                </table>
                                </div>
                           </div>`);

        $("#bet-bot-dialog").dialog({
            closeOnEscape: false,
            width: "100%",
            height: screen.height,
            resizable: true,
            open: function (event, ui) {
                $(".ui-dialog-titlebar-close").hide();
            }
        });

        vueApp = new Vue({
            el: '#bet-bot-dialog',
            data: {
                games: [],
                leagueGames: [],
                leagueExclusions: [],
                threshoolds: {
                    A_AP_P_SUM: 30,
                    golHome: 3,
                    golAway: 3,
                    attacchi: 25,
                    attacchi2: 25,
                    attacchiPericolosi: 15,
                    attacchiPericolosi2: 15,
                    attacchiPericolosiZeroZero: 20,
                    possesso: 20,
                    TiP: 5,
                    TfP: 5,
                    TiPHome: 5,
                    TiPAway: 5,
                    TfPHome: 5,
                    TfPAway: 5,
                    angoliHome: 5,
                    angoliAway: 5,
                    sTiP: 5,
                    sTfP: 5,
                    sAngoli: 5,
                    dAngoli:5,
                    quota1: 1.5,
                    quotaX: 1.5,
                    quota2: 1.5
                }
            },
            methods: {
                dataChangeHandler: function (event) {
                    chrome.storage.local.set({ 'configThreshold': vueApp.threshoolds }, function () {
                        // console.log('Value is set to:', vueApp.threshoolds);
                    });
                },
                addExclusion: function (leagueName) {
                    vueApp.leagueExclusions.push(leagueName);
                    chrome.storage.local.set({ 'configLeagueExclusions': vueApp.leagueExclusions }, function () {
                        // console.log('Value is set to:', vueApp.leagueExclusions);
                    });
                },
                removeExclusion: function (leagueName) {
                    vueApp.leagueExclusions = vueApp.leagueExclusions.filter(l => l !== leagueName);
                    chrome.storage.local.set({ 'configLeagueExclusions': vueApp.leagueExclusions }, function () {
                        // console.log('Value is set to:', vueApp.leagueExclusions);
                    });
                },
                makeDivFull: function(){
                    $('#mytable').toggleClass('fullscreen');
                    //$('#bet-bot-dialog').toggleClass('fullscreen'); 
                },
                barraLinea: function(countrow, event){
                    var myid = '#'+countrow;
                    if (event.target.checked) {       
                        
                        //alert(countrow);
                        $(myid).css("text-decoration", "line-through");
                     }
                    if (!event.target.checked) {
                        $(myid).css("text-decoration", "none");
                    }
                },
                hideHeader1: function(){
                    var x = document.getElementById("header1");
                    if (window.getComputedStyle(x).visibility === "hidden") {
                        $('#header1').show();
                      }
                    
                      if (window.getComputedStyle(x).display === "none") {
                        $('#header1').show();
                    }
                    
                    else{
                        $('#header1').hide();
                    }
                    
                },

                bloccaBianco: function(thisid){
                    //alert(thisid);
                    var myid1 = '#'+thisid;
                    $(myid1).css("background-color", "#ffffff");
                }

            }
        });

        chrome.storage.local.get(['configThreshold'], function (result) {
            if (result.configThreshold !== undefined) {
                vueApp.threshoolds = result.configThreshold;
            }
        });
        chrome.storage.local.get(['configLeagueExclusions'], function (result) {
            if (result.configLeagueExclusions !== undefined) {
                vueApp.leagueExclusions = result.configLeagueExclusions;
            }
        });

        // console.log("Loading configuration: ", vueApp.threshoolds);
    }, 1000);


    //Esiste la funzione eval() di javascript che valuta 
    //espressioni logiche a runtime (incluse variabili nello scope in cui viene chiamata)

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getData() {
        try {


            // for (var i = 0; i < $(".ovm-CompetitionHeader_Name").length; i++) {
            //     console.log($(".ovm-CompetitionHeader_Name")[i].innerText);
            // }
            var nLeagues = $(".ovm-CompetitionHeader_Name").length;
            var nGames = $(".ovm-FixtureDetailsTwoWay_TeamsWrapper").length;
            //vueApp.games.splice(0); //Clean array
            while (vueApp.games.length < nGames) {
                vueApp.games.push({});
            }

            var offset = 0;
            for (var i = 0; i < nGames; i++) {
                var thereIsData = $(".ovm-MediaIconContainer")[i].children[0].children.length == 0 ? false : true;
                var obj = null;

                if (thereIsData) {
                    //console.log("Processing line " + i);

                    $(".me-MediaButtonLoader")[i - offset].click(); //click on little field/play to open info about that game
                    await sleep(50);
                    $(".lv-ButtonBar_MatchLiveIcon").click(); //On the right panel click on the live match icon to open data about the game
                    await sleep(150);
                    $(".ml1-LocationEventsMenu_Text").click(); //Open info tab to retrieve for "posizione in classifica" info
                    await sleep(150);

                    var quotaCounter = i % 3;

                    obj = {
                        thereIsData: true,
                        leagueName: $($(".ovm-FixtureDetailsTwoWay_TeamsWrapper")[i])?.parent()?.parent()?.parent()?.parent()?.parent()?.parent()?.parent()?.parent()[0]?.children[0]?.children[0]?.children[0]?.innerText,
                        time: $(".ml1-SoccerClock_Clock")[0]?.innerText,
                        homeTeam: $(".ovm-FixtureDetailsTwoWay_TeamsWrapper")[i]?.children[0]?.innerText,
                        awayTeam: $(".ovm-FixtureDetailsTwoWay_TeamsWrapper")[i]?.children[1]?.innerText,
                        postoHomeTeam: $(".ml1-TeamsWrapper_HomeTeamPosition")[0]?.innerText.replace(" posto", ""),
                        postoAwayTeam: $(".ml1-TeamsWrapper_AwayTeamPosition")[0]?.innerText.replace(" posto", ""),
                        lastTs: new Date().toLocaleTimeString(),
                        //golHome: parseInt($(".lsb-ScoreBasedScoreboard_TeamScore")[0]?.innerText),
                        golHome: parseInt($(".lsb-ScoreBasedScoreboardAggregate_TeamScore ")[0]?.innerText),
                        //golAway: parseInt($(".lsb-ScoreBasedScoreboard_TeamScore")[1]?.innerText),
                        golAway: parseInt($(".lsb-ScoreBasedScoreboardAggregate_TeamScore ")[1]?.innerText),
                        attacchiHome: $(".ml-WheelChart_Team1Text")[0]?.innerText,
                        //attacchiPericolosiHome: $(".ml-WheelChart_Team1Text")[1]?.innerText,
                        attacchiPericolosiHome: $(".ml1-StatsUpperAdvanced")[0]?.children[1]?.children[1]?.children[0]?.innerText,
                        //possessoHome: $(".ml-WheelChart_Team1Text")[2]?.innerText,
                        possessoHome: $(".ml1-StatsUpperAdvanced")[0]?.children[2]?.children[1]?.children[0]?.innerText,
                        attacchiAway: $(".ml-WheelChart_Team2Text")[0]?.innerText,
                        //attacchiPericolosiAway: $(".ml-WheelChart_Team2Text")[1]?.innerText,
                        attacchiPericolosiAway: $(".ml1-StatsUpperAdvanced")[0]?.children[1]?.children[1]?.children[2]?.innerText,
                        //possessoAway: $(".ml-WheelChart_Team2Text")[2]?.innerText,
                        possessoAway: $(".ml1-StatsUpperAdvanced")[0]?.children[2]?.children[1]?.children[2]?.innerText,
                        cartelliniGialliHome: $(".ml1-StatsLower_MiniHomeWrapper")[0]?.children[0]?.children[0]?.children[0]?.innerText,
                        cartelliniRossiHome: $(".ml1-StatsLower_MiniHomeWrapper")[0]?.children[0]?.children[0]?.children[1]?.innerText,
                        //angoliHome: $(".ml1-StatsLower_MiniHomeWrapper")[0]?.children[0]?.children[0]?.children[2]?.innerText,
                        angoliHome: $(".ml1-StatsLowerAdvanced")[0]?.children[0]?.children[0]?.children[1]?.innerText,
                        cartelliniGialliAway: $(".ml1-StatsLower_MiniAwayWrapper")[0]?.children[0]?.children[0]?.children[2]?.innerText,
                        cartelliniRossiAway: $(".ml1-StatsLower_MiniAwayWrapper")[0]?.children[0]?.children[0]?.children[1]?.innerText,
                        //angoliAway: $(".ml1-StatsLower_MiniAwayWrapper")[0]?.children[0]?.children[0]?.children[0]?.innerText,
                        angoliAway: $(".ml1-StatsLowerAdvanced")[0]?.children[2]?.children[0]?.children[1]?.innerText,
                        //tiriInPortaHome: $(".ml1-StatsLower_MiniBarWrapper")[0]?.children[0]?.children[1]?.children[0]?.innerText,
                        tiriInPortaHome: $(".ml1-StatsLowerAdvanced")[0]?.children[1]?.children[1]?.children[0]?.children[2]?.innerText,
                        //tiriInPortaAway: $(".ml1-StatsLower_MiniBarWrapper")[0]?.children[0]?.children[1]?.children[2]?.innerText,
                        tiriInPortaAway: $(".ml1-StatsLowerAdvanced")[0]?.children[1]?.children[1]?.children[2]?.children[2]?.innerText,
                        //tiriFuoriPortaHome: $(".ml1-StatsLower_MiniBarWrapper")[1]?.children[0]?.children[1]?.children[0]?.innerText,
                        tiriFuoriPortaHome: $(".ml1-StatsLowerAdvanced")[0]?.children[1]?.children[1]?.children[0]?.children[0]?.innerText,
                        //tiriFuoriPortaAway: $(".ml1-StatsLower_MiniBarWrapper")[1]?.children[0]?.children[1]?.children[2]?.innerText,
                        tiriFuoriPortaAway: $(".ml1-StatsLowerAdvanced")[0]?.children[1]?.children[1]?.children[2]?.children[0]?.innerText,
                        quota1: parseFloat($(".ovm-ParticipantOddsOnly_Odds")[i * 3 + 0].innerText),
                        quotaX: parseFloat($(".ovm-ParticipantOddsOnly_Odds")[i * 3 + 1].innerText),
                        quota2: parseFloat($(".ovm-ParticipantOddsOnly_Odds")[i * 3 + 2].innerText)
                    }
                    //calcoli
                    obj['differenzaAttacchi'] = Math.abs(obj.attacchiHome - obj.attacchiAway);
                    obj['differenzaAttacchiPericolosi'] = Math.abs(obj.attacchiPericolosiHome - obj.attacchiPericolosiAway);
                    obj['differenzaPossesso'] = Math.abs(obj.possessoHome - obj.possessoAway);
                    obj['differenzaTiriInPorta'] = Math.abs(obj.tiriInPortaHome - obj.tiriInPortaAway);
                    obj['differenzaTiriFuoriPorta'] = Math.abs(obj.tiriFuoriPortaHome - obj.tiriFuoriPortaAway);

                    obj['sommaTiriInPorta'] = Math.abs(parseInt(obj.tiriInPortaHome) + parseInt(obj.tiriInPortaAway));
                    obj['sommaTiriFuoriPorta'] = Math.abs(parseInt(obj.tiriFuoriPortaHome) + parseInt(obj.tiriFuoriPortaAway));
                    obj['sommaAngoli'] = Math.abs(parseInt(obj.angoliHome) + parseInt(obj.angoliAway));
                    obj['differenzaAngoli'] = Math.abs(parseInt(obj.angoliHome) - parseInt(obj.angoliAway));

                    obj['sommaGol'] = obj.golHome + obj.golAway;
                    obj['A_AP_P_SUM'] = obj['differenzaAttacchi'] + obj['differenzaAttacchiPericolosi'] + obj['differenzaPossesso'];

                    obj['class_golHome'] = 'golColumn';
                    obj['class_golAway'] = 'golColumn';

                    if (obj.golHome + obj.golAway == 0) {
                        obj['class_golHome'] += ' verdepastello';
                        obj['class_golAway'] += ' verdepastello';
                    }
                    if (obj.golHome > vueApp.threshoolds.golHome) {
                        obj['class_golHome'] += ' verdepastello';
                    }
                    if (obj.golAway > vueApp.threshoolds.golAway) {
                        obj['class_golAway'] += ' verdepastello';
                    }

                    //console.log(obj);
                } else {
                    offset++;
                    console.log("Missing data on line " + i);
                    obj = {
                        thereIsData: false,
                        leagueName: $($(".ovm-FixtureDetailsTwoWay_TeamsWrapper")[i])?.parent()?.parent()?.parent()?.parent()?.parent()?.parent()?.parent()?.parent()[0]?.children[0]?.children[0]?.children[0]?.innerText,
                        time: $(".ml1-SoccerClock_Clock")[0]?.innerText,
                        homeTeam: $(".ovm-FixtureDetailsTwoWay_TeamsWrapper")[i]?.children[0]?.innerText,
                        awayTeam: $(".ovm-FixtureDetailsTwoWay_TeamsWrapper")[i]?.children[1]?.innerText,
                        lastTs: new Date().toLocaleTimeString()
                    }
                }

                Vue.set(vueApp.games, i, obj);
                var leagueGames = {};
                vueApp.games.forEach((g) => {
                    if (!vueApp.leagueExclusions.includes(g.leagueName)) {
                        leagueGames[g.leagueName] = leagueGames[g.leagueName] || [];
                        leagueGames[g.leagueName].push(g);
                    }
                });
                Vue.set(vueApp, 'leagueGames', leagueGames);
            }

        } catch (e) {
            console.log("Error: ", e);
        }
        setTimeout(getData, 1000);
    }


    setTimeout(getData, 2000);
});


