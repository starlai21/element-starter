import axios from 'axios';

// axios.defaults.baseURL = 'http://10.202.46.40:8080';
axios.defaults.baseURL = 'http://localhost:8080';

axios.defaults.timeout = 8000;





export const requestLogin = params => { return axios.post('/auth/login', params).then(res => res.data)};
export const fetchAuditingData = params => {
	return axios.post('/audit',  params).then(res => res.data).catch(res => res)
};

export const fetchAuditedData = params => {
	return axios.post('/audited',  params).then(res => res.data).catch(res => res)
};

export const postAuditingForm = params => { return axios.post('/auditForm', params).then(res => res.data)};

export const fetchPictures = params => {
	return axios.get('/pictures',  {params:params}).then(res => res.data).catch(res => res)
};

export const fetchLogs = params => {
	return axios.get('/logs',  {params:params}).then(res => res.data).catch(res => res)
};

export const submitPassedData = () => {
	return axios.post('/submit').then(res => res.data).catch(res => res)
};

export const sendSafeCode = params => {
	return axios.get('/safeCode',{params:params}).then(res => res.data).catch(res => res)
};


export const fetchUndispatchedOrders = params => {
	return axios.post('/undispatchedOrders',  params).then(res => res.data).catch(res => res)
};

export const fetchDispatchedOrders = params => {
	return axios.post('/dispatchedOrders',  params).then(res => res.data).catch(res => res)
};

export const fetchDeliveryMen = params => {
	return axios.get('/deliveryMen',{params:params}).then(res => res.data).catch(res => res)
};

export const fetchBusinessHalls = params => {
	return axios.get('/businessHalls',{params:params}).then(res => res.data).catch(res => res)
};
