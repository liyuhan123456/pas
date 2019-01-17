import React, {Component} from 'react'
import {
    Breadcrumb,
    Input,
    Button,
    message,
    Form,
    Divider,
    AutoComplete
} from 'antd';
import {log} from '../../utils/utils';
import {
    fetchOrderDetail,
    fetchProductList,
    saveOrder,
    queryAgent,
    fetchAgentDetail
} from '../../service/index';
const noImg = require('../../assets/noImg.png');
const FormItem = Form.Item;
const Option = AutoComplete.Option;
class AgentOrderDetail extends Component {
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
                seller_id: this.props.location.state.agentId,
                seller_name: '',
                species: 0,
                quantity: 0,
                amount: 0,
                product_image: '',
                product_quantity: '',
                list: []
            },
            agentList: [],
            lastSelectName: '',
            agentInfoList: [],
            productList: [],
            productInfoList: []
        };
        this.timeoutFlag = '';
        this.searchAgent = this.searchAgent.bind(this);
        this.searchProduct = this.searchProduct.bind(this);
        this.selectAgent = this.selectAgent.bind(this);
        this.selectProduct = this.selectProduct.bind(this);
        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.isNumber = this.isNumber.bind(this);
        this.handleSaveOrder = this.handleSaveOrder.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.handleFetchOrderDetail();
        }else{
            fetchAgentDetail({
                id: this.props.location.state.agentId
            }).then(res=>{
                let orderForm = {...this.state.orderForm};
                orderForm.seller_name = res.data.name;
                this.setState({
                    orderForm
                })
            })
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
                    this.setState({
                        orderForm: res.data
                    })
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

    handleSaveOrder() {
        let form = {...this.state.orderForm};
        form.list = form.list.filter(item=>item.product_id !== '');
        saveOrder(form).then(res=>{
                if(res.error === 0){
                    log(res);
                    message.success("保存成功",1,()=>{
                        this.props.history.push(`/index/agent/order/${this.props.location.state.agentId}`)
                    });
                }else{
                    message.error("保存失败，请检查网络或服务器状态");
                }
            }).catch(err=>{
                log(err);
            })
    }

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
                    return dataList.push(<Option key={item.id} text={item.name}>{`${item.name}-${item.phone}`}</Option>);
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
            product_name: '',
            product_image: '',
            product_quantity: '',
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
        let {name, price, quantity, image} = this.state.productInfoList.filter(item => {
            return item.id === +value
        })[0];
        let item = this.state.orderForm.list[index];
        setTimeout(() => {
            this.inputProductField('orderForm', index, 'product_name', name);
            this.inputProductField('orderForm', index, 'product_id', value);
            this.inputProductField('orderForm', index, 'price', item.price || (parseInt(price,10) || 0));
            this.inputProductField('orderForm', index, 'product_quantity', quantity || 0);
            this.inputProductField('orderForm', index, 'product_image', image);
            this.inputProductField('orderForm', index, 'quantity', item.quantity || 1, true);
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
                    this.props.history.push('/index/agent')
                }}>代理商管理</a></Breadcrumb.Item>
                <Breadcrumb.Item><a href="#" onClick={(e) => {
                    e.preventDefault();
                    this.props.history.push(`/index/agent/order/${this.props.location.state.agentId}`)
                }}>代理商详情</a></Breadcrumb.Item>
                <Breadcrumb.Item>代理商订单详情</Breadcrumb.Item>
            </Breadcrumb>
            <Form style={{marginTop: 50}}>
                <FormItem
                    label='代理商'
                    labelCol={{span: 2}}
                    wrapperCol={{span: 22}}
                >
                   <Input style={{ width: 300 }} readOnly={true} value={this.state.orderForm.seller_name} />
                </FormItem>
                <Button style={{ zIndex: 99,position: 'sticky', top: '20%', left: '60%'}} type={"primary"}
                        onClick={this.handleAddProduct}>添加商品</Button>
                {
                    this.state.orderForm.list.map((item, index) => {
                        return (
                            <div key={index}>
                                <FormItem
                                    label={`商品${index + 1}图片`}
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                <img src={item.product_image || noImg} alt="商品图片" style={{ border: '1px solid #ccc', width: 400, height: 300 }}/>
                                </FormItem>
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
                                                    this.inputProductField('orderForm', index, 'product_quantity', 0);
                                                    this.inputProductField('orderForm', index, 'quantity', 0, true);
                                                    this.inputProductField('orderForm', index, 'amount', 0, true);
                                                    this.inputProductField('orderForm', index, 'product_image', '');
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
                                    <span style={{marginLeft: 20, display: 'inline-block'}}>库存：{item.product_quantity}</span>}
                                </FormItem>
                                <FormItem
                                    label={`商品${index + 1}价格`}
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <Input style={{maxWidth: 300}} value={item.price}
                                           onChange={(e) => {
                                               this.inputProductField('orderForm', index, 'price', e.target.value,);
                                           }}
                                           onBlur={() => {
                                               let value = Math.abs(parseInt((item.price+'').trim()));
                                               value = value || 0;
                                               if (this.isNumber(value)) {
                                                   this.inputProductField('orderForm', index, 'price', value, true);
                                               } else {
                                                   this.inputProductField('orderForm', index, 'price', 0, true);
                                               }
                                           }}/>
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
                                           onBlur={() => {
                                               let value = Math.abs(parseInt((item.quantity+'').trim()));
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
                                    <span style={{fontSize: 18, color: '#fe8d03'}}>{item.amount}元</span>
                                </FormItem>
                                <Button style={{margin: '10px 0 30px 4.7%'}} type={"danger"}
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
                    <span style={{fontSize: 18, color: '#fe8d03'}}>{this.state.orderForm.amount}元</span>
                </FormItem>
            </Form>
            <Button style={{margin: '30px 0 10px 8.3333%'}} type={"primary"}
                    onClick={this.handleSaveOrder}>保存</Button>
        </div>
    }
}

export default AgentOrderDetail;