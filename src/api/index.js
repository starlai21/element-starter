import axios from 'axios';

axios.default.baseURL = 'http://127.0.0.1:8080';


export const requestLogin = params => { return axios.post('/auth/login', params).then(res => res.data)};
export const fetchAuditingData = params => {
	return axios.get('/auditing', {params: params}).then(res => res.data).catch(res => res)
};