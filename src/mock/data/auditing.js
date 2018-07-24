import Mock from 'mockjs'
var Random = Mock.Random
const Auditings = Mock.mock({
	"array|10-20": [
		{
			"name":'@cname',
			"mobile|1":['13531544954','13632250649','15820292420','15999905612'],
			"id":'@id',
			"channel":"@city",
			"entryDate":"@datetime('yyyy-MM-dd')",
			"type|1-5": 1,
			"specialType|1-10":1,
			"livingPicture": Random.image('700x323', Random.color(), '#FFF', '1'),
			"idPicture":Random.image('700x323', Random.color(), '#FFF', '2'),
		}
	]
}).array

var users= []
for(let i=0;i<Random.integer(10,20);i++){
	users.push(Mock.mock({
			"name":'@cname',
			"mobile|1":['13531544954','13632250649','15820292420','15999905612'],
			"id":'@id',
			"channel":"@city",
			"entryDate":"@datetime('yyyy-MM-dd')",
			"type|1-5": 1,
			"specialType|1-10":1,
			"livingPicture": Random.image('700x323', Random.color(), '#FFF', '1'),
			"idPicture":Random.image('700x323', Random.color(), '#FFF', '2'),
    }))
}
 
export { Auditings, users }
