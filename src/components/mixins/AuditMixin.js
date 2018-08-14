import moment from 'moment';
var AuditMixin = {
  computed:{
    sDate(){
      if (this.searchForm.startDate === null)
        return null;
      else
        return new Date(this.searchForm.startDate).getTime();
    },
    eDate(){
      if(this.searchForm.endDate === null)
        return null;
      else
        return new Date(this.searchForm.endDate).getTime();
    }
  },
  filters:{
    dateFormatter(date){
      return moment(date).format('l');
    }
  },
	data(){
		return {
			searchForm: {
	          mobile: '',
	          types: [],
	          channel: '',
	          startDate: null,
	          endDate: null,
            updateFrom: null,
            updateTo: null,
	          specialTypes: [],
	          isVisible: true,
	          bodyStyle:{
	            padding: '0px'
	          },
	          states: []
	        },		
	        violationOptions: [{
	          value: '1',
	          label: '人脸无法辨识'
	        }, {
	          value: '2',
	          label: '非活体照'
	        }, {
	          value: '3',
	          label: '人证不一致'
	        }, {
	          value: '4',
	          label: '未按规范拍摄现场人脸照'
	        },{
              value: '5',
              label: '大头照'
            }, {
              value: '6',
              label: '非正面清晰照/完整照'
            }, {
              value: '7',
              label: '未按要求持证/未持证'
            }, {
              value: '8',
              label: '其他'
            }],		
            typeOptions: [{
              value: '1',
              label: '1'
            },{
              value: '2',
              label: '2'
            },{
              value: '3',
              label: '3'
            },{
              value: '4',
              label: '4'
            },{
              value: '5',
              label: '5'
            }],
            channelOptions: [{
              value: '1',
              label: '1'
            },{
              value: '2',
              label: '2'
            },{
              value: '3',
              label: '3'
            },{
              value: '4',
              label: '4'
            }],

            specialtyOptions: [{
              value: '1',
              label: '1'
            },{
              value: '2',
              label: '2'
            },{
              value: '3',
              label: '3'
            },{
              value: '4',
              label: '4'
            },{
              value: '5',
              label: '5'
            }],

			statesOptions: [{
              value: '1',
              label: '人工审核通过'
            },{
              value: '2',
              label: '人工审核未通过'
            },{
              value: '3',
              label: '县分已处理-已重拍-待重新取照'
            },{
              value: '4',
              label: '县分已处理-其他-待二审'
            },{
              value: '5',
              label: '已重新取照-待二审'
            }],
		    note: '',
		    violationValue: '',
        isLoading: false,
        page: {
          total: 0,
          currentPage: 1
        },
        successLoading:false,
        failureLoading:false,
        pictureLoading:false
		};
	},
	methods:{
	    clearForm(formName){
	    	this.$refs[formName].resetFields();
        this.searchForm.updateTo = null;
        this.searchForm.updateFrom = null;
	    },
      	resetAuditForm(){
         	this.violationValue = '';
         	this.note = '';
       	},
	    onSubmit(state){
         	if (state === 'success'){
        		this.send(1);
         	}
        	else{
           		if ((this.violationValue !== '' && this.violationValue !== "8") || (this.violationValue === '8' && this.note !== '')){
            		this.send(2);
           		}
           		else{
            		this.$message({
            			type: 'error',
            			message: '请选择未通过原因或填写备注!',
               			duration: 3000
            		});
           		}
        	}
	    },
      livingPic(pictures){
        
        if (pictures && pictures.length >0 && (pictures.length === 2 || pictures[0].type === 0)){
          var pic =  pictures.filter((c,i,a) => {
            return c.type === 0
          })
          return pic[0].url;
        }
        return "https://dummyimage.com/600x400/000000/fff&text=default";
      },
      idPic(pictures){
        
        if (pictures && pictures.length > 0 && (pictures.length === 2 || pictures[0].type === 1)){
          var pic =  pictures.filter((c,i,a) => {
            return c.type === 1
          })
          return pic[0].url;
        }
        return "https://dummyimage.com/600x400/000000/fff&text=default";
      },
      stateFormatter(state){
        let states = ["未审核","人工审核通过","人工审核未通过","县分已处理-已重拍-待重新取照","县分已处理-其他-待二审","已重新取照-待二审"];
        return states[state];
      }
	}
}


export {AuditMixin}