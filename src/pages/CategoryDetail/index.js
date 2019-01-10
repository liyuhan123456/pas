import React, {Component} from 'react'
import {Breadcrumb,Input,Button,message,Form} from 'antd';
import {log} from '../../utils/utils';
import {saveCategory} from '../../service/index';
const FormItem = Form.Item;
class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idLoading: false,
            categoryInfo: (this.props.history.location.state && this.props.history.location.state.categoryInfo) || {
                type: this.props.history.location.state.type,
                code: '',
                name: '',
                description: '',
            }
        };
        this.handleSave = this.handleSave.bind(this);
    }
    inputField(table,field,value){
        let data = this.state[table];
        data[field] = value;
        this.setState({
            [table]: data
        })
    }
    handleSave(){
        this.setState({
            isLoading: true
        },()=>{
            saveCategory(this.state.categoryInfo).then(res=>{
                if(res.error === 0){
                    message.success('保存类别信息成功!',1,()=>{
                        this.props.history.push('/index/category',{type: this.state.categoryInfo.type});
                    })
                }else{
                    message.error('保存类别信息失败,请稍后再试或检查服务器状态!',1);
                }
            }).catch(err=>{
                message.error('保存类别信息失败,请稍后再试或检查服务器状态!',1);
                log(err);
            }).finally(()=>{
                this.setState({
                    isLoading: false
                })
            })
        })
    }
    componentDidMount(){
    }

    render() {
        return (
            <div className="block">
                <Breadcrumb>
                    <Breadcrumb.Item><a href="#" onClick={(e)=>{e.preventDefault();this.props.history.push('/index/category',{type: this.state.categoryInfo.type})}}>类别管理</a></Breadcrumb.Item>
                    <Breadcrumb.Item>类别详情</Breadcrumb.Item>
                </Breadcrumb>
                <Form style={{ marginTop: 50 }}>
                    <FormItem
                        label='类别名称'
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                    >
                        <Input style={{ maxWidth: 300 }} value={this.state.categoryInfo.name}  onChange={(e)=>{this.inputField('categoryInfo','name',e.target.value)}} />
                    </FormItem>
                    <FormItem
                        label='类别代码'
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                    >
                        <Input style={{ maxWidth: 300 }} value={this.state.categoryInfo.code}  onChange={(e)=>{this.inputField('categoryInfo','code',e.target.value)}} />
                    </FormItem>
                    <FormItem
                        label='类别介绍'
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                    >
                        <Input style={{ maxWidth: 300 }} value={this.state.categoryInfo.description}  onChange={(e)=>{this.inputField('categoryInfo','description',e.target.value)}} />
                    </FormItem>
                    <FormItem
                        label='类别类型'
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                    >
                        <Input style={{ maxWidth: 300 }} value={this.state.categoryInfo.type} />
                    </FormItem>
                </Form>
                <Button loading={this.state.isLoading} style={{ marginLeft: '8.33333333%', marginTop: 10 }} type="primary" onClick={this.handleSave}>保存</Button>
            </div>
        )
    }
}

export default Category