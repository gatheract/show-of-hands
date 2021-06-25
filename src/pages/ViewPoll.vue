<template>
	<div>
		<!-- Finished loading -->
		<div v-if="!loading && !error">
			<b-row class="mb-3">
				<b-col>
					<h3>{{ title }}</h3>
				</b-col>
			</b-row>

			<!-- Not voted-->
			<div>
				<b-row>
					<b-col>
						<b-form @submit.prevent="vote">
							<b-form-group>
								<div class="mb-3" v-for="(choice, index) in choices" :key="index">
									<b-form-radio name="choice"
										:id="'choice' + index" :value="index" v-model="choicePicked">
										{{ choice.title }}	
									</b-form-radio>
								</div>
							</b-form-group>

							<b-button type="submit" variant="primary">Vote</b-button>
						</b-form>
					</b-col>
			
					<b-col>
						<div v-for="(choice, index) in choices" :key="index">
							<span v-if="index == indexVoted">
								<b-icon icon="check-circle-fill" variant="success" style="font-size: 1.5rem"></b-icon>
							</span>

							{{ choice.title }}
							<b-progress height="2rem" class="mb-2">
								<b-progress-bar :style="'background:' + choicesColors[index]" :value="votePercent(index)">
									<span>{{ votePercent(index) }}% ({{ choice.votes }} votes)</span>
								</b-progress-bar>
							</b-progress>
						</div>

						<h5 class="mt-3">Total Votes: {{ total_votes }}</h5>
					</b-col>

					<b-col>
						<PollChart :chartData="chartData" :height="300" />
					</b-col>
				</b-row>
			</div>
		</div>
	</div>
</template>

<script>
/*global gatheract*/
import { mapState } from 'vuex';
import store from '@/store';
import db from '@/db'

import PollChart from '@/components/PollChart';

export default {
	components: {
		PollChart,
	},

	data() {
		return {
			title: "",
			choices: [],
			total_votes: 0,
			choicePicked: -1, // The choice picked from the vote form
			indexVoted: -1, 	// The index this IP has voted on
			chartData: {},		// Chart data
			choicesColors: [	// Colors for the chart and stats
				'#01BAEF', '#0CBABA', '#F2CD5D',
				'#D741A7', '#F0F3BD', '#ED7D3A',
				'#C69C72', '#49416D', '#B3F2DD',
			] 
		};
	},

	computed: mapState(['error', 'loading', 'user']),

	async created() {

		this.reload_db();
		store.commit('setLoading', false);
		window.addEventListener('new_db_data', function (e) { this.reload_db() }.bind(this), false);
	},

	methods: {

		reload_db() {
			// Read choices
			this.choices = db.choices;
			this.title = db.title;
			this.total_votes = db.total_votes;
			// Update chart data
			let chartLabels = [];
			let chartDatasets = [
				{
					label: "Data",
					data: []
				}
			];

			db.choices.forEach((choice) => {
				chartLabels.push(choice.title);
				chartDatasets[0].data.push(choice.votes);
			});

			chartDatasets[0].backgroundColor = this.choicesColors;

			this.chartData = {
				labels: chartLabels,
				datasets: chartDatasets,
			};
			this.$forceUpdate();
		},
	

		votePercent(index) {
			// Calculate the percent a vote holds from the total votes
			if (db.total_votes == 0) {
				return 0;
			} else {
				return ((db.choices[index].votes / db.total_votes) * 100).toFixed(2);
			}
		},

		async vote() {
			if (this.choicePicked == -1) {
				return;
			}

			gatheract.sendMessage({
				type: "vote",
				vote: this.choicePicked
			}, null, true)

			db.update();

			// Reload page
			this.reload_db();
			//this.$router.go();
		},
	},
};
</script>

<style lang="scss" scoped>

</style>
