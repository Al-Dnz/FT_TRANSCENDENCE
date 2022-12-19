import Vuex from 'vuex';
import { createStore } from 'vuex';
import io from 'socket.io-client';

const hostIp = "0.0.0.0";

export default createStore({
	state:
	{
		globalSocket: {},
		chatSocket: {},
		gameSocket: {}
	},
	mutations:
	{
		setGlobalSocket(state, authPayload) {
			state.globalSocket = io(`http://${hostIp}:3003`, authPayload);
		},

		setChatSocket(state, authPayload) {
			state.chatSocket = io(`http://${hostIp}:3004`, authPayload);
		},

		setGameSocket(state, authPayload) {
			state.gameSocket = io(`http://${hostIp}:3005`, authPayload);
		},

	},
	actions:
	{
		setAllSockets({commit, state}, authToken)
		{
			const authPayload = { auth: { token: authToken} };
			commit('setGlobalSocket', authPayload);
			commit('setChatSocket', authPayload);
			commit('setGameSocket', authPayload);
		},
		setGlobalSocket({commit, state}, authToken)
		{
			const authPayload = { auth: { token: authToken} };
			commit('setGlobalSocket', authPayload);
		},
		setChatSocket({commit, state}, authToken)
		{
			const authPayload = { auth: { token: authToken} };
			commit('setChatSocket', authPayload);
		},
		setGameSocket({commit, state}, authToken)
		{
			const authPayload = { auth: { token: authToken} };
			commit('setGameSocket', authPayload);
		}
	}
})