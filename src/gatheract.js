import db from "./db";
/*global gatheract*/

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
            const ci_event = new Event('ga_channelInfo');
            window.dispatchEvent(ci_event);
            },
        appMessage: (data, from) => { 
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
