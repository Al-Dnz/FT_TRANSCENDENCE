import Vuex from 'vuex';

import { createStore } from 'vuex'

export default createStore({
	state:
	{
		globalSocket: null,
		chatSocket: null,
		gameSocket: null
	},
	mutations:
	{
		setGlobalSocket(state, connection) {
			state.globalSocket = connection;
		},

		setChatSocket(state, connection) {
			state.chatSocket = connection;
		},

		setGameSocket(state, connection) {
			state.gameSocket = connection;
		},
	}
})