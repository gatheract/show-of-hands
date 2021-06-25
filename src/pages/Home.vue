<template>
	<div>
		
		<div v-if="isHost">
			<CreatePollForm />
		</div>

		<ViewPoll />

	</div>
</template>

<script>
/*global gatheract*/
import store from '@/store';

import CreatePollForm from '@/components/CreatePollForm';
import ViewPoll from '@/pages/ViewPoll';

export default {
	components: {
		CreatePollForm,
		ViewPoll
	},

	data() {
		return {
			isHost: false,
		};
	},

	mounted() {
		window.addEventListener('ga_channelInfo', function (e) { this.isHost = gatheract.isHost; }.bind(this), false);
	}
};
</script>

<style lang="scss" scoped>

</style>
