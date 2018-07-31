import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8080';

axios.defaults.timeout = 5000;





export const requestLogin = params => { return axios.post('/auth/login', params).then(res => res.data)};
export const fetchAuditingData = params => {
	return axios.post('/audit',  params).then(res => res.data).catch(res => res)
};

export const fetchAuditedData = params => {
	return axios.post('/audited',  params).then(res => res.data).catch(res => res)
};

export const postAuditingForm = params => { return axios.post('/auditForm', params).then(res => res.data)};