<template>
	<div id="app">
		<Navbar />
		
		<b-container>
			<Error />

			<LoadingSpinner />

			<router-view/>
		</b-container>
	</div>
</template>

<script>

import Navbar from '@/components/Navbar';
import Error from '@/components/Error';
import LoadingSpinner from '@/components/LoadingSpinner';
import gatheract from '@/gatheract'

export default {
	components: {
		Navbar,
		Error,
		LoadingSpinner,
	},

	mounted() {
		
	},

	created() {
	},
}
</script>

<style lang="scss">
</style>