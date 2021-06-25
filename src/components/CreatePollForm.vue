<template>
	<b-row>
		<b-col>
			<h3>Create a poll</h3>
			<b-form @submit.prevent="createPoll">
				<b-row class="mb-3">
					<b-col cols="12" sm="2">
						<label for="title" class="col-form-label">Title</label>
					</b-col>
					<b-col cols="12" sm="10">
						<b-form-input id="title"
							v-model="title" placeholder="What is your question?" required></b-form-input>
					</b-col>
				</b-row>

				<b-row class="mb-3">
					<b-col cols="12" sm="2">
						<label for="title" class="col-form-label">Choices</label>
					</b-col>
					<b-col cols="12" sm="10">
						<div v-for="(choice, index) in choices" :key="index">
							<b-form-input class="mb-3"
								v-model="choices[index]" placeholder="Type a choice..."
								@focus="focusChoice(index)"></b-form-input>
						</div>
					</b-col>
				</b-row>

				<b-row class="mb-3">
					<b-col>
						<b-button type="submit" variant="primary">Create Poll</b-button>
					</b-col>
				</b-row>
			</b-form>
		</b-col>
	</b-row>
</template>

<script>
/*global gatheract*/
import store from '@/store';
import db from '@/db';
import { mapState } from 'vuex';

export default {
	data() {
		return {
			title: '',
			choices: ['', '', ''],
			enforceLogin: false,
		}
	},

	computed: mapState(['error', 'user']),
	
	methods: {
		async createPoll() {
			if (this.title.trim() == '') {
				store.commit('setError', 'Title cannot be blank.');
				return;
			}

			// Trim the choices so there will be no empty choices in between
			const trimmedChoices = this.choices.filter((choice) => {
				if (choice.trim() != '') return choice.trim();
			});
			
			if (trimmedChoices.length < 2) {
				store.commit('setError', 'You must specify at least 2 choices.');
				return;
			}

			// Set poll document
			db.title = this.title;
			
			// Set poll's choices documents
			let index = 0;
			for (const choice of trimmedChoices) {
				db.choices[index] = {
					title: choice,
					votes: 0
				};

				index++;
			}

			gatheract.sendMessage({
				type: "poll",
				vote: db.votes,
				title: db.title,
				choices: db.choices
			}, null, true)

		},

		focusChoice(index) {
			if (index == this.choices.length - 1) {
				this.choices.push('');
			}
		},
	},
}
</script>

<style lang="scss" scoped>

</style>