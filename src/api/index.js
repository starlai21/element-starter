import axios from 'axios';




//服务器
axios.defaults.baseURL = 'http://10.202.46.40:8080';
// axios.defaults.baseURL = 'http://localhost:8080';
// axios.defaults.baseURL = 'http://10.21.114.215:8080';



axios.defaults.timeout = 158000;



//auth

export const requestLogin = params => { return axios.post('/auth/login', params).then(res => res.data)};

export const requestChangePassword = params => { return axios.post('/auth/changePassword', params).then(res => res.data)};






// report 
export const downloadExcel = params => {
	return axios({url: '/report/auditedList', method:'post', data:params, responseType:'blob'}).then(res =>res).catch()
};


export const generateReport = params => {
	return axios({url: '/report/generate', method:'post', data:params, responseType:'blob'}).then(res =>res).catch()
};

export const getAbnormalCallReport = params => {
	return axios.get('/report/abnormalCall',{params:params}).then(res => res.data).catch(res => res)
};

export const exportAbnormalCallReport = params => {
	return axios({url: '/report/exportAbnormalCall', method:'post', data:params, responseType:'blob'}).then(res =>res).catch()
};








//audit

export const fetchAuditingData = params => {
	return axios.post('/audit/getAuditData',  params).then(res => res.data).catch(res => res)
};

export const fetchAuditedData = params => {
	return axios.post('/audit/getAuditedData',  params).then(res => res.data).catch(res => res)
};

export const postAuditingForm = params => { return axios.post('/audit/save', params).then(res => res.data)};

export const fetchPictures = params => {
	return axios.get('/audit/getPictures',  {params:params}).then(res => res.data).catch(res => res)
};

export const fetchLogs = params => {
	return axios.get('/audit/getLogs',  {params:params}).then(res => res.data).catch(res => res)
};

export const submitPassedData = () => {
	return axios.post('/audit/submit').then(res => res.data).catch(res => res)
};

export const sendSafeCode = params => {
	return axios.get('/audit/safeCode',{params:params}).then(res => res.data).catch(res => res)
};



