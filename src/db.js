
const db = {
    votes: {},
    title: "",
    choices: [],
    total_votes: 0,
    update() {
        this.choices.forEach((choice) => {
            choice.votes = 0;
        })
        this.total_votes = 0;
        Object.keys(this.votes).forEach((id) =>{
            this.choices[this.votes[id]].votes++
            this.total_votes++;
        })
        const event = new Event('new_db_data')
        window.dispatchEvent(event);
    },
};

export default db;