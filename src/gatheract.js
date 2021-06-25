import db from "./db";
import ViewPool from "./pages/ViewPoll.vue"
/*global gatheract*/
function loadExtScript(src, test, callback) {
    var s = document.createElement('script');
    s.src = src;
    document.body.appendChild(s);

    var callbackTimer = setInterval(function () {
        var call = false;
        try {
            call = test.call();
        } catch (e) {
            console.log(e);
        }

        if (call) {
            clearInterval(callbackTimer);
            callback.call();
        }
    }, 100);
}


function load_gatheract() {
    gatheract.init({
        appId: 'poll_app',
        events: {
            connected: event => { },
            disconnected: event => { },
            channelInfo: event => {
                if (event.newUser && gatheract.isHost) {
                    gatheract.sendMessage({
                        type: "state",
                        title: db.title,
                        choices: db.choices,
                        votes: db.votes
                    }, [event.newUser.id])
                }
             },
            appMessage: (data, from) => { 
                console.log(data);
                if(data.type == 'poll') {
                    db.title = data.title;
                    db.choices = data.choices;
                    db.total_votes = 0;
                    db.votes = {};
                    db.update();
                } else if(data.type == 'state') {
                    db.title = data.title;
                    db.choices = data.choices;
                    db.votes = data.votes;
                    db.update();
                } else if(data.type == 'vote') {
                    db.votes[from] = data.vote;
                    db.update();
                }
            }
        }
    });
}

loadExtScript('https://gatheract.com/api.js', function () {
    return (typeof gatheract == 'object');
}, load_gatheract);
