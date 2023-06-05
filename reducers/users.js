import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	value: {
		_id: null,
		username: null,
		email: null,
		token: null,
		followed: null,
		avatar: null,
		notification: null,
	},
};

export const userSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		logUser: (state, action) => {
			state.value._id = action.payload._id
			state.value.username = action.payload.username 
			state.value.email = action.payload.email 
			state.value.token = action.payload.token 
			state.value.avatar = ""
		},
		logOut: (state) => {
			state.value._id = ''
			state.value.username = '' 
			state.value.email = ''
			state.value.token = ''
			state.value.followed = ''
			state.value.avatar =''
			state.value.notification= ''
		},
		updateName: (state, action) =>{
			state.value.username = action.payload;
		},
		updateMail: (state, action) =>{
			state.value.email = action.payload;
		},
		updateId: (state, action) => {
			state.value._id = action.payload
		},
		updateFollowed: (state, action) => {
			state.value.followed = action.payload
		},
		updateAvatar: (state, action) =>{
			state.value.avatar = action.payload
		},
		updateNotification: (state, action) =>{
			state.value.notification = action.payload
		}
	},
});

export const { updateId, logUser, logOut, updateName, updateMail, updateAvatar, updateNotification } = userSlice.actions;
export default userSlice.reducer;
