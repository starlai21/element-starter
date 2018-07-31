import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
 
import {Users} from './data/user'
import {Auditings, Auditeds} from './data/auditing'
export default {
 
    init() {
        let mock = new MockAdapter(axios)
        // mock success request
        mock.onGet('/success').reply(200, {
            msg: 'success'
        })
 
        // mock error request
        mock.onGet('/error').reply(500, {
            msg: 'failure'
        })
 
        // 登录
        mock.onPost('/auth/login').reply(arg => {
            let { username, password } = JSON.parse(arg.data)
            return new Promise((resolve, reject) => {
                let token = null
 
 
                let hasUser = Users.some(u => {
                    if (u.username === username && u.password === password) {
                        token = 'adminXXXXXX'
                        return true
                    }
                })
 
                if (hasUser) {
                    resolve([200, { code: 200, msg: '请求成功', token: token }])
                } else {
                    resolve([200, { code: 500, msg: '账号或密码错误' }])
                }
 
            })
        })

        //get auditing data
        mock.onPost('/auditing').reply(arg => {

            let {mobile, types, channels, startDate, endDate, specialTypes} = JSON.parse(arg.data)

            var data = Auditings.filter(u => {
                if ((mobile !== '' && mobile !== u.mobile) 
                    || (types.length !== 0 && types.indexOf(u.type.toString()) === -1) 
                    || (channels.length !== 0 && channels.indexOf(u.channel.toString()) === -1) 
                    || (specialTypes.length !== 0 && specialTypes.indexOf(u.specialType.toString()) === -1 )
                    || (startDate !== null && new Date(startDate).getTime() > new Date(u.entryDate).getTime())
                    || (endDate !== null && new Date(endDate).getTime() < new Date(u.entryDate).getTime())
                    )
                    return false;
                return true;
            })

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, { code: 200, auditings: data}])
                }, 1000);
                
            })
        })

        // get audited data
        mock.onPost('/audited').reply(arg => {

            let {mobile, types, channels, startDate, endDate, specialTypes, states} = JSON.parse(arg.data)
            // console.log(arg.data)
            var state_strs = ["","人工审核通过","人工审核未通过","县分已处理-已重拍-待重新取照","县分已处理-其他-待二审","已重新取照-待二审"]

            var data = Auditeds.filter(u => {
                if ((mobile !== '' && mobile !== u.mobile) 
                    || (types.length !== 0 && types.indexOf(u.type.toString()) === -1) 
                    || (channels.length !== 0 && channels.indexOf(u.channel.toString()) === -1) 
                    || (specialTypes.length !== 0 && specialTypes.indexOf(u.specialType.toString()) === -1 )
                    || (startDate !== null && new Date(startDate).getTime() > new Date(u.entryDate).getTime())
                    || (endDate !== null && new Date(endDate).getTime() < new Date(u.entryDate).getTime())
                    || (states.length !== 0 && states.indexOf(state_strs.indexOf(u.state).toString()) === -1)
                    )
                    return false;
                return true;
            })

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, { code: 200, data: data}])
                }, 1000);
                
            })
        })

        //submit audit form
        mock.onPost('/auditingForm').reply(arg => {
            let { state, note, violationValue, id } = JSON.parse(arg.data)
            console.log(id)
            return new Promise((resolve, reject) => {
                if (state === 'success')
                    state = "人工审核通过";
                else
                    state = "人工审核未通过";
                resolve([200, { code: 200, msg: '保存成功', state: state }])
 
            })
        })
 
 
 
    }
 
}
