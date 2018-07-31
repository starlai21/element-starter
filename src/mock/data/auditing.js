import Mock from 'mockjs'
var Random = Mock.Random
var Auditings = Mock.mock({
	"array|100-200": [
		{
			"name":'@cname',
			"mobile|1":['13531544954','13632250649','15820292420','15999905612'],
			"id":'@id',
			"channel|1-4":1,
			"entryDate":"@datetime('2016-MM-dd')",
			"type|1-5": 1,
			"specialType|1-5":1,
			"livingPicture": Random.image('700x323', Random.color(), '#FFF', '1'),
			"idPicture":Random.image('700x323', Random.color(), '#FFF', '2'),
		}
	]
}).array

var Auditeds = Mock.mock({
	"array|100-200": [
		{
			"name":'@cname',
			"mobile|1":['13531544954','13632250649','15820292420','15999905612'],
			"combo|1-9":1,
			"state|1":["人工审核通过","人工审核未通过","县分已处理-已重拍-待重新取照","县分已处理-其他-待二审","已重新取照-待二审"],
			"county|1":['鹿城','龙湾','瓯海','平阳','苍南','永嘉','瑞安'],
			"note":"@csentence",
			'auditorId|1':['123456','1111','123'],
			"id":'@id',
			"channel|1-4":1,
			"entryDate":"@datetime('2016-MM-dd')",
			"auditDate":"@datetime('2017-MM-dd')",
			"type|1-5": 1,
			"specialType|1-5":1,
			"livingPicture": Random.image('700x323', Random.color(), '#FFF', '1'),
			"idPicture":Random.image('700x323', Random.color(), '#FFF', '2'),
		}
	]
}).array
 
export { Auditings, Auditeds}
