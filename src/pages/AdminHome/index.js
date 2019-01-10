import React, {Component} from 'react'
import 'moment/locale/zh-cn';
import {Breadcrumb, Card, Icon, Avatar, Row, Col, Select, message, Input, Button, Spin, Popconfirm, Pagination } from 'antd';
import {log} from '../../utils/utils';
import {} from '../../service/index';
import moment from 'moment';
import {withRouter} from "react-router-dom";
import {fetchProductList,fetchCategoryList} from "../../service/index";
const { Meta } = Card;

@withRouter
class AdminHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeLoading: false,
            typeList: [
                {
                    name: '所有类别',
                    id: 0,
                }
            ],
            type: 0,
            keyword: '',
            lastKeyword: '',
            searchMode: false,
            pageNum: 1,
            rowTotal: 0,
            pageSize: 20,
            list: [],
            isLoading: false,
        };
        this.handleSearch = this.handleSearch.bind(this);
    }
    componentDidMount(){
        this.handleFetchCategoryList();
        this.handleFetchProductList();
    }
    handleFetchCategoryList(){
        this.setState({
            typeLoading: true,
        },()=>{
            fetchCategoryList({
                type: 'product'
            }).then(res=>{
                this.setState({
                    typeList: [...this.state.typeList,...res.data]
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
    handleFetchProductList(){
        this.setState({
            isLoading: true
        },()=>{
            fetchProductList({
                category_id: this.state.type,
                keyword: this.state.searchMode ? this.state.lastKeyword : '',
                page_num: this.state.pageNum,
                page_size: this.state.pageSize
            }).then(res=>{
                log(res);
                this.setState({
                    list: res.data.list,
                    rowTotal: res.data.totalRow,
                })
            }).catch(err=>{
                log(err);
                message.error("获取商品列表失败，请检查网络或服务器状态",1.5);
            }).finally(()=>{
                this.setState({
                    isLoading: false
                })
            })
        });

    }
    handleSearch(){
        this.setState({
            searchMode: true,
            lastKeyword: this.state.keyword,
        },()=>{
            this.handleFetchProductList()
        })
    }
    render() {
        return (
            <div className="block">
                <Breadcrumb>
                    <Breadcrumb.Item>商品管理</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ marginTop: 20 }}>
                    商品类型：
                    <Select style={{ width: 140,marginRight: 30 }} value={this.state.type} onChange={value=>{this.setState({type: value},()=>{this.handleSearch()})}}>
                        {
                            this.state.typeList.map(item=>{
                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            })
                        }
                    </Select>
                    关键字：
                    <Input onKeyDown={e=>{e.keyCode === 13 && this.handleSearch()}} style={{ display: 'inline-block', width: 300, marginRight: 30 }} value={this.state.keyword} onChange={e=>{this.setState({ keyword: e.target.value })}} placeholder={"输入商品名或商品编号进行查找"}/>
                    <Button type={"primary"} style={{ marginRight: 20 }} onClick={this.handleSearch}>查找</Button>
                    { this.state.searchMode && <span style={{ marginRight: 20 }} className="link_primary" onClick={()=>{this.setState({ pageNum: 1,searchMode: false, keyword: '', lastKeyword: '', type: 0 },()=>{this.handleFetchProductList()})}}>清除搜索条件</span> }
                    当前条件下共有 {this.state.rowTotal} 件商品
                </div>
                <div style={{ marginTop: 30 }}>
                    {
                        this.state.isLoading ?
                            <div style={{ textAlign: 'center',marginTop: 200 }}><Spin size={"large"}/></div> :
                            <div>
                                <Row gutter={{ xs:20, sm: 20, md: 30, xl: 30, xxl: 40 }}>
                                    { this.state.list.map(item=>{
                                        return  <Col key={item.id} style={{ marginBottom: 20,}}  xs={12} sm={8} md={8} xl={6} xxl={4}>
                                            <div style={{width: '100%' }}>
                                                <Card
                                                    hoverable
                                                    style={{ width: '100%' }}
                                                    cover={<img alt="image" src={item.image ? item.image : "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"} />}
                                                    actions={[<Icon style={{ fontSize: 26 }} type="edit" />,<Popconfirm title="确定要删除这个类别吗？" onConfirm={()=>{}} okText="是" cancelText="否"> <Icon style={{ fontSize: 26 }} type="delete" /></Popconfirm>]}
                                                >
                                                    <Meta
                                                        title={item.name}
                                                        description={<div><p style={{ marginBottom: 4 }}>介绍：{item.description}</p><p style={{ marginBottom: 4 }}>价格：{item.price}元</p></div>}
                                                    />
                                                </Card>
                                            </div>
                                        </Col>
                                    }) }

                                </Row>
                                <div style={{ marginTop: 20, textAlign: 'center' }}>
                                    <Pagination total={this.state.rowTotal} current={this.state.pageNum}  onChange={page=>{this.setState({ pageNum: page },()=>{this.handleFetchProductList()})}}  />
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default AdminHome