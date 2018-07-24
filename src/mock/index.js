import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
 
import {Users} from './data/user'
import {Auditings, users} from './data/auditing'
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

        mock.onGet('/auditing').reply(arg => {

            let {mobile, type, channel, startDate, endDate, specialTypes} = arg.params

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, { code: 200, auditings: users}])
                }, 1000);
                
            })
        })
 
 
 
    }
 
}
