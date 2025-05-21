<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// Load user data from storage if available
			this.$store.dispatch('user/loadUserFromStorage')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
