import React, {Component} from 'react'
import {Breadcrumb,Input,Button,message,Table,Popconfirm,Select} from 'antd';
import {log} from '../../utils/utils';
import {fetchCategoryList,fetchCategoryType,deleteCategory} from '../../service/index';
class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: (this.props.history.location.state && this.props.history.location.state.type) || 'product',
            list: [],
            isLoading: false,
            typeLoading: false,
            typeList: [],
        };
        this.categoryColumns = [
            {
                title: '类别名称',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '类别代码',
                dataIndex: 'code',
                align: 'center'
            },
            {
                title: '类别介绍',
                dataIndex: 'description',
                align: 'center'
            },
            {
                title: '操作',
                align: 'center',
                render: (text,record)=>{
                    return (
                        <div style={{display: 'flex',justifyContent: 'space-around'}}>
                            <Button type={"primary"} onClick={()=>{this.props.history.push('/index/category/detail',{categoryInfo: record})}}>详情</Button>
                            <Popconfirm title="确定要删除这个类别吗？" onConfirm={()=>{this.handleDeleteCategory(record.id)}} okText="是" cancelText="否">
                                <Button type={"danger"} >删除</Button>
                            </Popconfirm>
                        </div>
                    )
                }
            },
        ];
    }
    componentDidMount(){
        this.handleFetchCategoryList();
        this.handleFetchCategoryType();
    }
    handleDeleteCategory(id){
        deleteCategory({id}).then(res=>{
            if(res.error === 0){
                message.success("删除成功",1);
                this.handleFetchCategoryList();
            }else{
                message.error("删除失败,请稍后再试或检查服务器状态!",1);
            }
        }).catch(err=>{
            log(err);
            message.error("删除失败,请稍后再试或检查服务器状态!",1);
        })
    }
    handleFetchCategoryList(){
        this.setState({
            typeLoading: true
        },()=>{
            fetchCategoryList({
                type: this.state.type
            }).then(res=>{
                this.setState({
                    list: res.data
                })
            }).catch(err=>{
                log(err);
                message.error("获取类别列表失败，请检查网络或服务器状态！",1.5);
            }).finally(()=>{
                this.setState({
                    typeLoading: false
                })
            })
        });
    }
    handleFetchCategoryType(){
        this.setState({
            isLoading: true
        },()=>{
            fetchCategoryType().then(res=>{
                this.setState({
                    typeList: res.data
                })
            }).catch(err=>{
                log(err);
                message.error("获取类别列表失败，请检查网络或服务器状态！",1.5);
            }).finally(()=>{
                this.setState({
                    isLoading: false
                })
            })
        });
    }
    render() {
        return (
            <div className="block">
                <Breadcrumb>
                    <Breadcrumb.Item>类别管理</Breadcrumb.Item>
                </Breadcrumb>
                <Select loading={this.state.typeLoading} style={{ width: 140,marginTop: 20 }} value={this.state.type} onChange={value=>{this.setState({type: value},()=>{this.handleFetchCategoryList()})}}>
                    {
                        this.state.typeList.map(item=>{
                            return <Select.Option key={item} value={item}>{item}</Select.Option>
                        })
                    }
                </Select>
                <Button style={{ marginLeft: 20 }} type={"primary"} onClick={()=>{this.props.history.push('/index/category/detail',{ type: this.state.type })}}>新增类别</Button>
                <Table  loading={this.state.isLoading} style={{ marginTop: 30 }} rowKey={'id'} columns={this.categoryColumns} dataSource={this.state.list}  />
            </div>
        )
    }
}


export default Category