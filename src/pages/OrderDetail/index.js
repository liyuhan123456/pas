import React, {Component} from 'react'
import {
    Breadcrumb,
    Input,
    Button,
    message,
    Form,
    Divider,
    Modal,
    Popconfirm,
    Table,
    Select,
    AutoComplete
} from 'antd';
import {log} from '../../utils/utils';
import {
    fetchOrderDetail,
    fetchProductList,
    saveAgent,
    deleteOrder,
    fetchLevelList,
    queryAgent
} from '../../service/index';

const FormItem = Form.Item;
const Option = AutoComplete.Option;

class Agent extends Component {
    constructor(props) {
        super(props);
        log(this.props);
        this.state = {
            pageNum: 1,
            pageSize: 10,
            rowTotal: 0,
            list: [],
            isLoading: false,
            orderForm: {
                seller_id: '',
                seller_name: '',
                species: 0,
                quantity: 0,
                amount: 0,
                list: []
            },
            agentList: [],
            lastSelectName: '',
            // lastSelectProduct: '',
            agentInfoList: [],
            productList: [],
            productInfoList: []
        };
        this.timeoutFlag = '';
        // this.handleSaveAgent = this.handleSaveAgent.bind(this);
        this.searchAgent = this.searchAgent.bind(this);
        this.searchProduct = this.searchProduct.bind(this);
        this.selectAgent = this.selectAgent.bind(this);
        this.selectProduct = this.selectProduct.bind(this);
        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.isNumber = this.isNumber.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.handleFetchOrderDetail();
        }
    }

    handleFetchOrderDetail() {
        this.setState({
            isLoading: true
        }, () => {
            fetchOrderDetail({
                id: this.props.match.params.id
            }).then(res => {
                log(res);
                if (res.error === 0) {

                } else {
                    message.error("获取订单详情失败，请检查网络或服务器状态", 1.5)
                }
            }).catch(err => {
                log(err);
                message.error("获取订单详情失败，请检查网络或服务器状态", 1.5)
            }).finally(() => {
                this.setState({
                    isLoading: false
                })
            })
        })
    }

    // handleSaveAgent() {
    //     saveAgent(this.state.orderForm).then(res=>{
    //         if(res.error === 0){
    //             message.success("保存成功");
    //             this.setState({
    //                 orderVisible: false,
    //                 orderForm:{
    //                     series_no: '',
    //                     level_id: '',
    //                     name: '',
    //                     phone: '',
    //                     email: '',
    //                     qq: '',
    //                     weixin: '',
    //                     referrer_id: '',
    //                     description: '',
    //                     referrer_name: '',
    //                 },
    //                 lastSelectName: '',
    //             });
    //             this.handleFetchOrderList();
    //         }else{
    //             message.error("保存失败，请检查网络或服务器状态");
    //         }
    //     }).catch(err=>{
    //         log(err);
    //     })
    // }

    inputField(table, field, value) {
        let data = this.state[table];
        data[field] = value;
        this.setState({
            [table]: data
        })
    }

    inputProductField(table, index, field, value, isRefresh) {
        let data = this.state[table];
        data.list[index][field] = value;
        this.setState({
            [table]: data
        }, () => {
            isRefresh && this.handleComputedForm()
        });
    }

    searchAgent(value) {
        if (new Date().getTime() - this.flag < 300) {
            clearTimeout(this.timeoutFlag);
        }
        this.flag = new Date().getTime();
        this.timeoutFlag = setTimeout(() => {
            queryAgent({
                keyword: value
            }).then(res => {
                let dataList = [];
                res.data.map(item => {
                    dataList.push(<Option key={item.id} text={item.name}>{`${item.name}-${item.phone}`}</Option>);
                });
                this.setState({
                    agentList: dataList,
                    agentInfoList: res.data,
                })
            }).catch(err => {
                log(err);
            })
        }, 300);
    }

    selectAgent(value) {
        let name = this.state.agentInfoList.filter(item => {
            return item.id === +value
        })[0].name;
        setTimeout(() => {
            this.inputField('orderForm', 'seller_name', name);
            this.inputField('orderForm', 'seller_id', +value);
            this.setState({
                lastSelectName: name,
            });
        }, 0)
    }

    handleComputedForm() {
        let list = {...this.state.orderForm};
        list.species = 0;
        list.quantity = 0;
        list.amount = 0;
        list.list.map(item => {
            log(item);
            if (item.product_id !== '') {
                list.species++;
                list.quantity += item.quantity;
                item.amount = item.price * item.quantity;
                list.amount += item.amount;
            }
        });
        this.setState({
            orderForm: list
        })
    }

    handleAddProduct() {
        let form = {...this.state.orderForm};
        form.list.push({
            amount: 0,
            quantity: 0,
            price: 0,
            product_id: '',
            product_name: ''
        });
        this.setState({
            orderForm: form
        }, () => {
            this.handleComputedForm();
        })
    }

    searchProduct(value) {
        if (new Date().getTime() - this.flag < 300) {
            clearTimeout(this.timeoutFlag);
        }
        this.flag = new Date().getTime();
        this.timeoutFlag = setTimeout(() => {
            fetchProductList({
                keyword: value,
                page_num: 1,
                page_size: 200,
                category_id: 0
            }).then(res => {
                let dataList = [];
                res.data.list.map(item => {
                    dataList.push(<Option key={item.id} text={item.name}>{item.name}</Option>);
                });
                this.setState({
                    productList: dataList,
                    productInfoList: res.data.list,
                })
            }).catch(err => {
                log(err);
            })
        }, 300);
    }

    selectProduct(value, index) {
        let {name, price, quantity} = this.state.productInfoList.filter(item => {
            return item.id === +value
        })[0];
        setTimeout(() => {
            this.inputProductField('orderForm', index, 'product_name', name);
            this.inputProductField('orderForm', index, 'product_id', value);
            this.inputProductField('orderForm', index, 'price', parseInt(price,10) || 0);
            this.inputProductField('orderForm', index, 'count', quantity || 0);
            this.inputProductField('orderForm', index, 'quantity', 1, true);
        }, 0)
    }

    isNumber(obj) {
        return typeof obj === 'number' && !isNaN(obj)
    }
    handleDeleteProduct(index){
        let form = {...this.state.orderForm};
        form.list.splice(index,1);
        this.setState({
            orderForm: form
        }, () => {
            this.handleComputedForm();
        })
    }
    render() {
        return <div className="block">
            <Breadcrumb>
                <Breadcrumb.Item><a href="#" onClick={(e) => {
                    e.preventDefault();
                    this.props.history.push('/index/order')
                }}>订单管理</a></Breadcrumb.Item>
                <Breadcrumb.Item>订单详情</Breadcrumb.Item>
            </Breadcrumb>
            <Form style={{marginTop: 50}}>
                <FormItem
                    label='代理商'
                    labelCol={{span: 2}}
                    wrapperCol={{span: 22}}
                >
                    <AutoComplete
                        placeholder={"输入代理商名称或编号查找代理商"}
                        value={this.state.orderForm.seller_name}
                        dataSource={this.state.agentList}
                        style={{width: 300}}
                        onSelect={this.selectAgent}
                        onSearch={this.searchAgent}
                        onBlur={() => {
                            this.inputField('orderForm', 'seller_name', this.state.lastSelectName)
                        }}
                        onFocus={() => {
                            this.state.orderForm.seller_name !== '' && this.searchAgent(this.state.orderForm.seller_name)
                        }}
                        onChange={value => {
                            this.inputField('orderForm', 'seller_name', value);
                            this.setState({lastSelectName: ''}, () => {
                                this.inputField('orderForm', 'seller_id', '');
                            })
                        }}
                    >
                    </AutoComplete>
                </FormItem>
                <Button style={{margin: '10px 0 30px 4.7%'}} type={"primary"}
                        onClick={this.handleAddProduct}>添加商品</Button>
                {
                    this.state.orderForm.list.map((item, index) => {
                        return (
                            <div key={index}>
                                <FormItem
                                    label={`商品${index + 1}名称`}
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <AutoComplete
                                        placeholder={"输入商品名称或编号查找商品"}
                                        value={item.product_name}
                                        dataSource={this.state.productList}
                                        style={{width: 300}}
                                        onSelect={(value) => {
                                            this.selectProduct(value, index)
                                        }}
                                        onSearch={this.searchProduct}
                                        onBlur={() => {
                                            setTimeout(() => {
                                                if (item.product_id === '') {
                                                    this.inputProductField('orderForm', index, 'product_name', '');
                                                    this.inputProductField('orderForm', index, 'price', 0);
                                                    this.inputProductField('orderForm', index, 'count', 0);
                                                    this.inputProductField('orderForm', index, 'quantity', 0, true);
                                                    this.inputProductField('orderForm', index, 'amount', 0, true);
                                                }
                                            }, 0);
                                        }}
                                        onFocus={() => {
                                            this.searchProduct(item.product_name)
                                        }}
                                        onChange={value => {
                                            this.inputProductField('orderForm', index, 'product_name', value);
                                            this.inputProductField('orderForm', index, 'product_id', '');
                                        }}
                                    >
                                    </AutoComplete>
                                    {item.product_id &&
                                    <span style={{marginLeft: 20, display: 'inline-block'}}>库存：{item.count}</span>}
                                </FormItem>
                                <FormItem
                                    label={`商品${index + 1}价格`}
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <Input style={{maxWidth: 300}} value={item.price}/>
                                </FormItem>
                                <FormItem
                                    label={`商品${index + 1}数量`}
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <Input style={{maxWidth: 120}} value={item.quantity}
                                           placeholder={"请输入数字"}
                                           onChange={(e) => {
                                               this.inputProductField('orderForm', index, 'quantity', e.target.value,);
                                           }}
                                           onBlur={e => {
                                               let value = parseInt((item.quantity+'').trim());
                                               value = value || 0;
                                               if (this.isNumber(value)) {
                                                   this.inputProductField('orderForm', index, 'quantity', value, true);
                                               } else {
                                                   this.inputProductField('orderForm', index, 'quantity', 0, true);
                                               }
                                           }}/>
                                </FormItem>
                                <FormItem
                                    label={`商品${index + 1}总价`}
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <span style={{fontSize: 18, color: '#fe8d03'}}>{item.amount}</span>
                                </FormItem>
                                <Button style={{margin: '10px 0 30px 4.7%'}} type={"primary"}
                                        onClick={()=>{this.handleDeleteProduct(index)}}>删除</Button>
                                <Divider/>
                            </div>
                        )
                    })
                }
                <FormItem
                    label='商品种类数量'
                    labelCol={{span: 2}}
                    wrapperCol={{span: 22}}
                >
                    <span style={{fontSize: 18, color: '#fe8d03'}}>{this.state.orderForm.species}</span>
                </FormItem>
                <FormItem
                    label='商品件数'
                    labelCol={{span: 2}}
                    wrapperCol={{span: 22}}
                >
                    <span style={{fontSize: 18, color: '#fe8d03'}}>{this.state.orderForm.quantity}</span>
                </FormItem>
                <FormItem
                    label='商品总价'
                    labelCol={{span: 2}}
                    wrapperCol={{span: 22}}
                >
                    <span style={{fontSize: 18, color: '#fe8d03'}}>{this.state.orderForm.amount}</span>
                </FormItem>
            </Form>
        </div>
    }
}

export default Agent;