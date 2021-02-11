<template>
	<div>
		<div class="row" v-if="error != ''">
			<div class="col">
				<div class="alert alert-danger" role="alert">
						{{ error }}
					</div>
			</div>
		</div>

		<div v-if="!loading && error == ''">
			<div class="row">
				<div class="col">
					<h3>{{ this.poll.title }}</h3>
				</div>
			</div>

			<div class="row">
				<div class="col">
					<div v-if="!hasVoted">
						<form @submit.prevent="vote">
							<div class="form-check">
								<div class="row mb-3" v-for="(choice, index) in poll.choices" :key="index">
									<input type="radio" class="form-check-input"
										name="choice" :id="'choice'+index" :value="index" v-model="choicePicked">
									<label class="form-check-label" :for="'choice'+index">{{ choice }}</label>
								</div>
							</div>

							<button type="submit" class="btn btn-primary">Vote</button>
						</form>
					</div>
					<div v-else>
						voted
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import firebase from '@/firebase';
import db from '@/db';
import { getIP } from '@/helpers';

export default {
	data() {
		return {
			ip: '',
			error: '',
			loading: true,
			id: '',
			poll: [],
			hasVoted: false,
			choicePicked: -1
		}
	},

	async created() {
		this.id = this.$route.params.pollId;
		
		const poll = await db.collection('polls').doc(this.id).get();
		if (!poll.exists) {
			this.error = 'This poll does not exist';
		} else {
			this.poll = poll.data();
		}

		// Check if the user has already voted (by IP)
		this.ip = await getIP();
		const vote = await db.collection('polls').doc(this.id).collection('votes').doc(this.ip).get();
		this.hasVoted = vote.exists;

		this.loading = false;
	},
	
	methods: {
		async vote() {
			if (this.choicePicked == -1) {
				return;
			}

			// Add a vote document with the user's ip
			await db.collection('polls').doc(this.id).collection('votes').doc(this.ip).set({
				choice: this.choicePicked
			});

			// Increment total votes for poll
			await db.collection('polls').doc(this.id).update({
				total_votes: firebase.firestore.FieldValue.increment(1)
			});

			// Reload page
			this.$router.go();
		},
	},
};
</script>

<style lang="scss" scoped>

</style>