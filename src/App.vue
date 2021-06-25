<template>
	<div id="app">
		<Navbar />
		
		<b-container>
			<Error />

			<LoadingSpinner />

			<Home/>
		</b-container>
	</div>
</template>

<script>

import Navbar from '@/components/Navbar';
import Error from '@/components/Error';
import LoadingSpinner from '@/components/LoadingSpinner';
import Home from '@/pages/Home';
import gatheract from '@/gatheract'

export default {
	components: {
		Navbar,
		Error,
		LoadingSpinner,
		Home,
	},

	mounted() {
		
	},

	created() {
	},
}
</script>

<style lang="scss">
</style>