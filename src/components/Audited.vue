<template>
  <div id="audited">
    <el-card class="box-card" shadow="hover" :body-style="searchForm.bodyStyle">
      <div slot="header" class="clearfix">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item>
            <el-col :span="11">
              <el-form-item prop="startDate">
                <el-date-picker type="date" placeholder="起始时间"  v-model="searchForm.startDate" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endDate">
                <el-date-picker type="date" placeholder="终止时间"  v-model="searchForm.endDate" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" >查询</el-button>
          </el-form-item>
              <el-button style="float: right; padding: 14px 0px" type="text" @click="toggleSearchForm">
                <span v-if="searchForm.isVisible">折叠</span>
                <span v-else>展开</span>
              </el-button>
        </el-form>
      </div>
      <div>
        <transition name="el-zoom-in-top">
         <el-form ref="searchForm" :model="searchForm" label-width="80px" v-show="searchForm.isVisible">
                <el-form-item label="手机号码" prop="mobile" :rules="{pattern: /^1[34578]\d{9}$/, message: '请输入有效的手机号码！', trigger: 'blur'}" style="margin-top:10px">
                  <el-input v-model="searchForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="一证N户" prop="type">
                  <el-select v-model="searchForm.type" placeholder="请选择类型" style="width: 100%">
                    <el-option label="一" value="1"></el-option>
                    <el-option label="二" value="2"></el-option>
                    <el-option label="三" value="3"></el-option>
                    <el-option label="四" value="4"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发展渠道" prop="channel">
                  <el-select v-model="searchForm.channel" placeholder="请选择类型" style="width: 100%">
                    <el-option label="一" value="1"></el-option>
                    <el-option label="二" value="2"></el-option>
                    <el-option label="三" value="3"></el-option>
                    <el-option label="四" value="4"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="靓号类型" prop="specialTypes">
                  <el-select v-model="searchForm.specialTypes" multiple placeholder="请选择类型" style="width: 100%">
                    <el-option
                      v-for="item in specialtyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>        
                </el-form-item>   

                <el-form-item>
                  <el-button type="info" @click="clearForm('searchForm')">重置</el-button>
                  <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
          </el-form> 
          </transition>
      </div>

    </el-card>
    <el-table
      :data="tableData"
      style="width: 100%; margin-top:10px" border stripe>
      <el-table-column
        prop="tag"
        label="稽核结果"
        width="220" align="center"
        :filters="[{ text: '人工审核通过', value: '人工审核通过' }, { text: '人工审核未通过', value: '人工审核未通过' },
                 { text: '县分已处理-已重拍-待重新取照', value: '县分已处理-已重拍-待重新取照' }, { text: '县分已处理-其他-待二审', value: '县分已处理-其他-待二审' },
                 { text: '已重新取照-待二审', value: '已重新取照-待二审' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.tag === '人工审核通过' ? 'success' : 'danger'"
            disable-transitions>{{scope.row.tag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="entryDate"
        label="入网日期"
        sortable
        width="180"
        :filters="entryDateFilter"
        :filter-method="entryDateFilterHandler" align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="80" align="center">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="号码"
        width="200" align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        label="一证N户"
        width="100" align="center">
      </el-table-column>
      <el-table-column
        prop="specialType"
        label="靓号类型"
        width="100" align="center">
      </el-table-column>
      <el-table-column
        prop="combo"
        label="套餐"
        width="100" align="center">
      </el-table-column>
      <el-table-column
        prop="county"
        label="县分"
        width="100" align="center">
      </el-table-column>  

      <el-table-column
        prop="channel"
        label="发展渠道" align="center" width="400"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="note"
        label="备注" align="center" width="400"
      >
      </el-table-column>
      <el-table-column
        prop="auditDate"
        label="稽核日期"
        sortable
        width="180"
        :filters="auditDateFilter"
        :filter-method="auditDateFilterHandler" align="center"
      >
      </el-table-column>
      <el-table-column
        prop="auditorId"
        label="稽核工号"
        width="200" align="center">
      </el-table-column>
      <el-table-column
          prop="idPicture"
          header-align="center"
          align="center"
          width="100"
          label="照片">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              title="现场照/证件照"
              trigger="click">
              <img :src="scope.row.livingPicture"/>
              <img :src="scope.row.idPicture"/>
              <img slot="reference" :src="scope.row.livingPicture" :alt="scope.row.livingPicture" style="max-height: 100px;max-width: 80px">
            </el-popover>
          </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="reaudit(scope.row)">重新稽核</el-button>
        </template>
      </el-table-column>  

    </el-table>


    <!-- pagination -->
    <el-row>
      <el-pagination
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="100">
      </el-pagination>
    </el-row>

    <!-- reaudit dialog -->
<el-dialog :title="currentRowState" :visible.sync="isReauditDialogVisible" width="80%"  :before-close="handleClose">
          <el-row>
            <el-col :span="6">
              <el-card :body-style="{ padding: '10px' }" >
                <el-form label-position="left" label-width="80px" >
                  <el-form-item label="客户姓名:">
                    {{currentRow.name}}
                  </el-form-item>
                  <el-form-item label="手机号码:">
                    {{currentRow.mobile}}
                  </el-form-item>
                  <el-form-item label="身份证号:">
                    3303031999023234312
                  </el-form-item>
                  <el-form-item label="发展渠道:">
                    龙湾XX营业厅
                  </el-form-item>
                  <el-form-item label="入网时间:">
                    2018/07/01
                  </el-form-item>
                  <el-form-item label="一证N户:">
                    2
                  </el-form-item>
                  <el-form-item label="靓号类型:">
                    AA
                  </el-form-item>
                </el-form>
              </el-card> 
            </el-col>

            <el-col :span="8" :offset="1" >
              <el-card :body-style="{ padding: '0px' }">
                <img :src="currentRow.livingPicture" class="image">
                <div style="padding: 14px;">
                  <span>现场照</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-card :body-style="{ padding: '0px' }">
                <img :src="currentRow.idPicture" class="image">
                <div style="padding: 14px;">
                  <span>身份证照</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <!-- operations -->
          <el-row style="margin-top: 20px">
            <el-col :span="1" >
              <el-button type="success" style="padding: 16px" @click="onSubmit">通过</el-button>
            </el-col>       

                <el-col :span="4" :offset="5">
                  <el-select v-model="violationValue" placeholder="实名违规" clearable :disabled="nonComplainceValue != ''">
                    <el-option
                      v-for="item in violationOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4" :offset="1">
                  <el-select v-model="nonComplainceValue" placeholder="实名操作不合规" clearable :disabled="violationValue != ''">
                    <el-option
                      v-for="item in nonComplianceOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
      


                <el-col :span="6" :offset="1">
                  <el-input type="textarea" v-model="note" placeholder="备注"></el-input>
                </el-col>
                <el-col :span="2" :offset="0">
                  <el-button type="danger" style="padding: 16px" @click="onSubmit">未通过</el-button>
                </el-col>
            
          </el-row>

</el-dialog>

  </div>

</template>
<style type="text/css">
  #audited .el-form-item{
    margin-bottom: 10px;
  }
</style>

<script>
  export default {
    computed: {
      entryDateFilter: function(){
        var entryDates = this.tableData.map(function(a) {return a.entryDate;});
        var _entryDates = [];
        entryDates.filter(this.unique).forEach(function(e){
          _entryDates.push({text: e, value: e});
        });
        return _entryDates;
      },
      auditDateFilter: function(){
        var auditDates = this.tableData.map(function(a) {return a.auditDate;});
        var _auditDates = [];
        auditDates.filter(this.unique).forEach(function(e){
          _auditDates.push({text: e, value: e});
        });
        return _auditDates;
      }
    },
    data() {
      return {
        tableData: [{
          entryDate: '2016-05-02',
          name: '王小2',
          mobile: '13522324233',
          type:'2',
          specialType:'2',
          combo:'2',
          county:'龙湾',
          channel:'龙湾XX营业厅',
          note:'阿斯顿撒旦',
          auditDate:'2018-07-02',
          auditorId:'123',
          tag: '人工审核通过',
          livingPicture: 'https://placeimg.com/700/323/ANIMALS',
          idPicture:'https://placeimg.com/700/323/PEOPLE'
        }, {
          entryDate: '2016-05-03',
          name: '王小2',
          mobile: '13522324233',
          type:'2',
          specialType:'2',
          combo:'2',
          county:'龙湾',
          channel:'龙湾XX营业厅',
          note:'阿斯顿撒旦',
          auditDate:'2018-07-01',
          auditorId:'123',
          tag: '人工审核通过',
          livingPicture: 'https://placeimg.com/700/323/any',
          idPicture:'https://placeimg.com/700/323/people'
        }, {
          entryDate: '2016-05-04',
          name: '王小2',
          mobile: '13522324233',
          type:'2',
          specialType:'2',
          combo:'2',
          county:'龙湾',
          channel:'龙湾XX营业厅',
          note:'阿斯顿撒旦',
          auditDate:'2018-07-01',
          auditorId:'123',
          tag: '人工审核通过',
          livingPicture: 'https://placeimg.com/700/323/any',
          idPicture:'https://placeimg.com/700/323/people'
        }, {
          entryDate: '2016-05-09',
          name: '王小三',
          mobile: '13522324233',
          type:'2',
          specialType:'2',
          combo:'2',
          county:'龙湾',
          channel:'龙湾XX营业厅',
          note:'阿斯顿撒旦',
          auditDate:'2018-07-01',
          auditorId:'123',
          tag: '人工审核通过',
          livingPicture: 'https://placeimg.com/700/323/any',
          idPicture:'https://placeimg.com/700/323/people'
        }, {
          entryDate: '2016-05-10',
          name: '王小2',
          mobile: '13522324233',
          type:'2',
          specialType:'2',
          combo:'2',
          county:'龙湾',
          channel:'龙湾XX营业厅',
          note:'阿斯顿撒旦',
          auditDate:'2018-07-01',
          auditorId:'123',
          tag: '人工审核通过',
          livingPicture: 'https://placeimg.com/700/323/any',
          idPicture:'https://placeimg.com/700/323/people'
        }],
        searchForm: {
              mobile: '',
              type: '',
              channel: '',
              startDate: null,
              endDate: null,
              specialTypes: [],
              isVisible: false,
              bodyStyle:{
                padding: '0px'
              },
              isSubmitted: false
            },
        isReauditDialogVisible: false,
        currentRowState: "原稽核结果为: ",
        currentRow: [],

        violationOptions: [{
          value: '选项1',
          label: '人脸无法辨识'
        }, {
          value: '选项2',
          label: '非活体照'
        }, {
          value: '选项3',
          label: '人证不一致'
        }, {
          value: '选项4',
          label: '未按规范拍摄现场人脸照'
        }, {
          value: '选项5',
          label: '其他'
        }],   

        nonComplianceOptions: [{
          value: '选项1',
          label: '大头照'
        }, {
          value: '选项2',
          label: '非正面清晰照/完整照'
        }, {
          value: '选项3',
          label: '持证照'
        }, {
          value: '选项4',
          label: '其他'
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
        note: '',
        violationValue: '',
        nonComplainceValue: ''
      };
    },
    methods: {
      unique(value, index, self){
        return self.indexOf(value) === index;
      },

      onSubmit(){
        this.startHacking();
      },


      formatter(row, column) {
        return row.channel;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      entryDateFilterHandler(value, row, column) {
        return row.entryDate === value;
      },
      auditDateFilterHandler(value, row, column) {
        return row.auditDate  === value;
      },
      search(){
          this.$refs['searchForm'].validate((valid) => {
            if (valid) {
              this.form.isSubmitted = true;
              alert('search...');
            } else {
                console.log('error submit!!');
                return false;
            }
          });
      },
      toggleSearchForm(){
        this.searchForm.isVisible = !this.searchForm.isVisible;
        // if(this.isConditionChanged())
        //   this.searchForm.bodyStyle.padding = '10px';
        // else
        //   this.searchForm.bodyStyle.padding = '0px';
      },
      clearForm(formName){
        // this.searchForm.isSpecial = false;
        this.$refs[formName].resetFields();
      },
      onSubmit(){
        this.startHacking();
      },
      isConditionChanged(){
        var form = this.searchForm;
        return form.mobile != '' || form.type != '' || form.channel != '' || form.specialTypes.length !== 0 || form.startDate != null || form.endDate != null;
      },    
      reaudit(row){
        this.currentRow = row;
        this.currentRowState = "原稽核结果为: " + row.tag;
        this.isReauditDialogVisible = true;
      },
      handleClose(done) {
        if (this.note == '' && this.violationValue == '' && this.nonComplainceValue == '')
          done();
        else{
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        }
      },

    startHacking () {
        this.$notify({
          title: 'It works!',
          type: 'success',
          message: 'We\'ve laid the ground work for you. It\'s time for you to build something epic!',
          duration: 5000
        })
      },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      }  
    }
  }
</script>