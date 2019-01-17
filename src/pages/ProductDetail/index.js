import React, {Component} from 'react'
import {
    Breadcrumb,
    Input,
    Button,
    message,
    Form,
    Upload,
    Icon,
    Modal,
    Select,
    Tabs,
    Spin,
    Divider,
    Switch,
    Popconfirm,
    Table
} from 'antd';
import {log} from '../../utils/utils';
import {
    upload,
    saveProduct,
    fetchCategoryList,
    fetchPriceList,
    savePrice,
    fetchLevelList,
    deletePrice,
    fetchInventoryList,
    saveInventoryRecord,
    deleteInventoryRecord,
} from '../../service/index';

const FormItem = Form.Item;

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idLoading: false,
            typeLoading: false,
            typeList: [],
            productInfo: this.props.history.location.state.productInfo || {
                name: '',
                price: '',
                image: '',
                quantity: '',
                category_id: this.props.history.location.state.category_id,
                series_no: '',
                specification: '',
                description: '',
            },
            fileList: (this.props.history.location.state.productInfo && this.props.history.location.state.productInfo.image && [{
                type: "image/jpeg",
                uid: '0',
                thumbUrl: this.props.history.location.state.productInfo.image,
                name: ''
            }]) || [],
            previewImage: '',
            previewVisible: false,
            activeKey: '1',
            //    价格管理
            priceLoading: false,
            priceEditAble: false,
            priceList: [],
            priceSaveLoading: false,
            addPriceVisible: false,
            levelId: '',
            levelList: [],
            batches: '',
            price: '',
            description: '',
            levelLoading: false,
            // 库存管理
            inventoryLoading: false,
            pageNum: 1,
            pageSize: 10,
            rowTotal: 0,
            inventoryList: [],
            editInventoryVisible: false,
            addInventoryVisible: false,
            addInventoryForm: {
                changes: '',
                factory: '',
                memo: '',
                order_id: '',
                origin: '',
                price: '',
                product_id: '',
                quantity: '',
            },
            editInventoryForm: {
                changes: '',
                factory: '',
                id: '',
                memo: '',
                order_id: '',
                origin: '',
                price: '',
                product_id: '',
                quantity: '',
            }

        };
        this.inventoryColumns = [
            {
                title: '生产厂家',
                dataIndex: 'factory',
                align: 'center'
            },
            {
                title: '进出库数量',
                dataIndex: 'changes',
                align: 'center'
            },
            {
                title: '进出库价格',
                dataIndex: 'price',
                align: 'center'
            },
            {
                title: '库存剩余数量',
                dataIndex: 'quantity',
                align: 'center'
            },
            {
                title: '原产地',
                dataIndex: 'origin',
                align: 'center'
            },
            {
                title: '进出库日期',
                dataIndex: 'date',
                align: 'center'
            },
            {
                title: '订单号',
                dataIndex: 'order_id',
                align: 'center'
            },
            {
                title: '备注',
                dataIndex: 'memo',
                align: 'center'
            },
            {
                title: '操作',
                align: 'center',
                render: (text, record) => {
                    return (
                        <div style={{display: 'flex', justifyContent: 'space-around'}}>
                            <Button type={"primary"} onClick={()=>{this.handleChangeInventoryRecord(record)}}>修改</Button>
                            <Popconfirm title="确定要删除这条记录吗？" onConfirm={() => {
                                this.handleDeleteInventoryRecord(record.id)
                            }} okText="是" cancelText="否">
                                <Button type={"danger"}>删除</Button>
                            </Popconfirm>
                        </div>
                    )
                }
            },
        ];
        this.handleSave = this.handleSave.bind(this);
        this.handleImgChange = this.handleImgChange.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.insertPriceField = this.insertPriceField.bind(this);
        this.handleSavePriceList = this.handleSavePriceList.bind(this);
        this.handleSavePrice = this.handleSavePrice.bind(this);
        this.handleSaveInventoryRecord = this.handleSaveInventoryRecord.bind(this);
    }

    componentDidMount() {
        this.handleFetchCategoryList();
        //    获取代理商列表
        this.setState({
            levelLoading: true
        }, () => {
            fetchLevelList(
                {
                    pageNum: 1,
                    pageSize: 1000
                }
            ).then(res => {
                this.setState({
                    levelList: res.data.list,
                    levelId: res.data.list[0] ? res.data.list[0].id : ''
                })
            }).catch(err => {
                log(err);
            }).finally(() => {
                this.setState({
                    levelLoading: false
                });
            })
        });
    }

    handleFetchCategoryList() {
        this.setState({
            typeLoading: true,
        }, () => {
            fetchCategoryList({
                type: 'product'
            }).then(res => {
                this.setState({
                    typeList: res.data
                });
                if (this.state.productInfo.category_id === '' && res.data[0]) {
                    this.inputField('productInfo', 'category_id', res.data[0].id)
                }
            }).catch(err => {
                log(err);
                message.error("获取类别列表失败，请检查网络或服务器状态！", 1.5);
            }).finally(() => {
                this.setState({
                    typeLoading: false
                })
            })
        });
    }

    inputField(table, field, value) {
        let data = this.state[table];
        data[field] = value;
        this.setState({
            [table]: data
        })
    }

    handleSave() {
        this.setState({
            isLoading: true
        }, () => {
            saveProduct(this.state.productInfo).then(res => {
                if (res.error === 0) {
                    message.success('保存商品信息成功!', 1);
                    this.setState({
                        productInfo: res.data
                    })
                } else {
                    message.error('保存商品信息失败,请稍后再试或检查服务器状态!', 1);
                }
            }).catch(err => {
                message.error('保存商品信息失败,请稍后再试或检查服务器状态!', 1);
                log(err);
            }).finally(() => {
                this.setState({
                    isLoading: false
                })
            })
        })
    }

    handleImgChange({file, fileList}) {
        let formData = new FormData();
        formData.append('file', file);
        upload(formData).then(res => {
            let img = `http://sales.diigii.com:8080${res.file}`;
            this.setState({
                fileList: [
                    {
                        type: "image/jpeg",
                        uid: '0',
                        thumbUrl: img,
                        name: file.name
                    }
                ]
            });
            this.inputField('productInfo', 'image', img);
        }).catch(err => {
            log(err);
            message.error('上传图片失败', 1.5);
        })

    }

    handlePreview(file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleFetchPriceList() {
        this.setState({
            priceLoading: true
        }, () => {
            fetchPriceList({
                product_id: this.state.productInfo.id
            }).then(res => {
                log(res);
                this.setState({
                    priceList: res.data
                })
            }).catch(err => {
                log(err);
                message.error("获取价格列表失败，请检查网络或服务器状态", 1.5);
            }).finally(() => {
                this.setState({
                    priceLoading: false
                });
            });
        });
    }

    insertPriceField(index, field, value) {
        if (this.state.priceEditAble) {
            let data = [...this.state.priceList];
            data[index][field] = value;
            this.setState({
                priceList: data
            });
        }

    }

    handleSavePriceList() {
        this.setState({
            priceSaveLoading: true
        }, () => {
            let list = [];
            this.state.priceList.map(item => {
                list.push(savePrice(item));
            });
            Promise.all(list).then(res => {
                log(res);
            }).catch(err => {
                log(err);
                message.error("保存价格失败,请检查网络或服务器状态", 1.5);
            }).finally(() => {
                this.setState({
                    priceSaveLoading: false,
                    priceEditAble: false
                });
                this.handleFetchPriceList();
            })
        });

    }

    handleSavePrice() {
        savePrice({
            product_id: this.state.productInfo.id,
            level_id: this.state.levelId,
            batches: this.state.batches,
            price: this.state.price,
            description: this.state.description
        }).then(res => {
            log(res);
            if (res.error === 0) {
                this.setState({
                    addPriceVisible: false,
                    description: '',
                    price: '',
                    batches: ''

                }, () => {
                    this.handleFetchPriceList();
                })
            }
        }).catch(err => {
            log(err);
        })
    }

    handleDeleteProduct(id) {
        deletePrice({id}).then(res => {
            if (res.error === 0) {
                message.success("删除成功", 1);
                this.handleFetchPriceList();
            } else {
                message.error("删除失败,请稍后再试或检查服务器状态!", 1);
            }
        }).catch(err => {
            log(err);
            message.error("删除失败,请稍后再试或检查服务器状态!", 1);
        })
    }

    handleFetchInventoryList() {
        this.setState({
            inventoryLoading: true
        }, () => {
            fetchInventoryList({
                product_id: this.state.productInfo.id,
                page_num: this.state.pageNum,
                page_size: this.state.pageSize
            }).then(res => {
                log(res);
                this.setState({
                    inventoryList: res.data.list,
                    rowTotal: res.data.totalRow
                })
            }).catch(err => {
                log(err);
                message.error("获取库存记录列表失败，请检查网络和服务器状态", 1.6);
            }).finally(() => {
                this.setState({
                    inventoryLoading: false
                })
            })
        });

    }

    handleChangeInventoryRecord(record){
        this.setState({
            editInventoryForm: {
                changes: record.changes,
                factory: record.factory,
                id: record.id,
                memo: record.memo,
                order_id: record.order_id,
                origin: record.origin,
                price: record.price,
                product_id: record.product_id,
                quantity: record.quantity,
            },
            editInventoryVisible: true
        })
    }

    handleSaveInventoryRecord(){
        if(this.state.editInventoryVisible){
            saveInventoryRecord(this.state.editInventoryForm).then(res=>{
                if(res.error === 0){
                    message.success("保存成功");
                    this.setState({
                        editInventoryVisible: false
                    });
                    this.handleFetchInventoryList();
                }else{
                    message.error("修改库存记录失败，请检查网络或服务器状态");
                }
            }).catch(err=>{
                log(err);
                message.error("修改库存记录失败，请检查网络或服务器状态");
            })
        }
       if(this.state.addInventoryVisible){
           saveInventoryRecord(this.state.addInventoryForm).then(res=>{
               if(res.error === 0){
                   message.success("保存成功");
                   let form = {...this.state.productInfo};
                   form.quantity = res.data.quantity;
                   this.setState({
                       productInfo: form,
                       addInventoryVisible: false,
                       addInventoryForm: {
                           changes: '',
                           factory: '',
                           memo: '',
                           order_id: '',
                           origin: '',
                           price: '',
                           product_id: this.state.productInfo.id,
                           quantity: '',
                       },
                   });
                   this.handleFetchInventoryList();
               }else{
                   message.error("修改库存记录失败，请检查网络或服务器状态");
               }
           }).catch(err=>{
               log(err);
               message.error("修改库存记录失败，请检查网络或服务器状态");
           })
       }
    }

    handleDeleteInventoryRecord(id){
        deleteInventoryRecord({id}).then(res=>{
            if(res.error === 0){
                message.success("删除成功",1);
                this.handleFetchInventoryList();
            }else{
                message.error("删除失败,请稍后再试或检查服务器状态!",1);
            }
        }).catch(err=>{
            log(err);
            message.error("删除失败,请稍后再试或检查服务器状态!",1);
        })
    }

    render() {
        return (
            <div className="block">
                <Breadcrumb>
                    <Breadcrumb.Item><a href="#" onClick={(e) => {
                        e.preventDefault();
                        this.props.history.push('/index/home', {category_id: this.state.productInfo.category_id})
                    }}>商品管理</a></Breadcrumb.Item>
                    <Breadcrumb.Item>商品详情</Breadcrumb.Item>
                </Breadcrumb>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={() => {
                    this.setState({previewVisible: false})
                }}>
                    <img alt="prevImg" style={{width: '100%'}} src={this.state.previewImage}/>
                </Modal>
                <Modal visible={this.state.addPriceVisible} onOk={this.handleSavePrice} onCancel={() => {
                    this.setState({addPriceVisible: false})
                }}>
                    <Form style={{marginBottom: 20}}>
                        <FormItem
                            label='代理级别'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Select style={{width: 300}} loading={this.state.levelLoading} value={this.state.levelId}
                                    onChange={value => {
                                        this.setState({levelId: value})
                                    }}>
                                {
                                    this.state.levelList.map(item => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </FormItem>
                        <FormItem
                            label='价格'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} value={this.state.price} onChange={(e) => {
                                this.setState({price: e.target.value})
                            }}/>
                        </FormItem>
                        <FormItem
                            label='起批数量'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} value={this.state.batches} onChange={(e) => {
                                this.setState({batches: e.target.value})
                            }}/>
                        </FormItem>
                        <FormItem
                            label='详细说明'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} value={this.state.description} onChange={(e) => {
                                this.setState({description: e.target.value})
                            }}/>
                        </FormItem>
                    </Form>
                </Modal>
                <Modal width={640} visible={this.state.editInventoryVisible} onOk={this.handleSaveInventoryRecord} onCancel={() => {
                    this.setState({editInventoryVisible: false})
                }}>
                    <Form style={{marginBottom: 20}}>
                        <FormItem
                            label='生产厂家'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} value={this.state.editInventoryForm.factory} onChange={(e)=>{this.inputField('editInventoryForm','factory',e.target.value)}}/>
                        </FormItem>
                        <FormItem
                            label='进出库数量'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input placeholder={"如500为进库500,-500为出库500"} style={{maxWidth: 300}} value={this.state.editInventoryForm.changes} onChange={(e)=>{this.inputField('editInventoryForm','changes',e.target.value)}}/>
                        </FormItem>
                        <FormItem
                            label='进出库价格'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} value={this.state.editInventoryForm.price} onChange={(e)=>{this.inputField('editInventoryForm','price',e.target.value)}}/>
                        </FormItem>
                        <FormItem
                            label='库存剩余数量'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} value={this.state.editInventoryForm.quantity} onChange={(e)=>{this.inputField('editInventoryForm','quantity',e.target.value)}}/>
                        </FormItem>
                        <FormItem
                            label='原产地'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} value={this.state.editInventoryForm.origin} onChange={(e)=>{this.inputField('editInventoryForm','origin',e.target.value)}}/>
                        </FormItem>
                        <FormItem
                            label='订单号'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} placeholder={"非销售订单号时为空"} value={this.state.editInventoryForm.order_id} onChange={(e)=>{this.inputField('editInventoryForm','order_id',e.target.value)}}/>
                        </FormItem>
                        <FormItem
                            label='备注'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} value={this.state.editInventoryForm.memo} onChange={(e)=>{this.inputField('editInventoryForm','memo',e.target.value)}}/>
                        </FormItem>
                    </Form>
                </Modal>
                <Modal width={640} visible={this.state.addInventoryVisible} onOk={this.handleSaveInventoryRecord} onCancel={() => {
                    this.setState({addInventoryVisible: false})
                }}>
                    <Form style={{marginBottom: 20}}>
                        <FormItem
                            label='生产厂家'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} value={this.state.addInventoryForm.factory} onChange={(e)=>{this.inputField('addInventoryForm','factory',e.target.value)}}/>
                        </FormItem>
                        <FormItem
                            label='进出库数量'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input placeholder={"如500为进库500,-500为出库500"} style={{maxWidth: 300}} value={this.state.addInventoryForm.changes} onChange={(e)=>{this.inputField('addInventoryForm','changes',e.target.value)}}/>
                        </FormItem>
                        <FormItem
                            label='进出库价格'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} value={this.state.addInventoryForm.price} onChange={(e)=>{this.inputField('addInventoryForm','price',e.target.value)}}/>
                        </FormItem>
                        <FormItem
                            label='原产地'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} value={this.state.addInventoryForm.origin} onChange={(e)=>{this.inputField('addInventoryForm','origin',e.target.value)}}/>
                        </FormItem>
                        <FormItem
                            label='订单号'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} placeholder={"非销售订单号时为空"} value={this.state.addInventoryForm.order_id} onChange={(e)=>{this.inputField('addInventoryForm','order_id',e.target.value)}}/>
                        </FormItem>
                        <FormItem
                            label='备注'
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Input style={{maxWidth: 300}} value={this.state.addInventoryForm.memo} onChange={(e)=>{this.inputField('addInventoryForm','memo',e.target.value)}}/>
                        </FormItem>
                    </Form>
                </Modal>
                <Tabs style={{marginTop: 20}} activeKey={this.state.activeKey} onChange={key => {
                    this.setState({activeKey: key}, () => {
                        key === '2' && this.handleFetchPriceList();
                        key === '3' && this.handleFetchInventoryList();
                    })
                }}>
                    <Tabs.TabPane key={'1'} tab={'商品信息'}>
                        <div>
                            <Form style={{marginTop: 50}}>
                                <FormItem
                                    label='商品名称'
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <Input style={{maxWidth: 300}} value={this.state.productInfo.name}
                                           onChange={(e) => {
                                               this.inputField('productInfo', 'name', e.target.value)
                                           }}/>
                                </FormItem>
                                <FormItem
                                    label='零售价格'
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <Input style={{maxWidth: 300}} value={this.state.productInfo.price}
                                           onChange={(e) => {
                                               this.inputField('productInfo', 'price', e.target.value)
                                           }}/>
                                </FormItem>
                                <FormItem
                                    label='商品图片'
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <Upload
                                        listType="picture-card"
                                        fileList={this.state.fileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleImgChange}
                                        accept={".jpg,.png,.jpeg,.gif"}
                                        beforeUpload={() => {
                                            return false
                                        }}
                                        onRemove={() => {
                                            this.inputField('productInfo', 'image', '');
                                            this.setState({fileList: []});
                                            return false
                                        }}
                                    >
                                        {this.state.fileList.length >= 1 ? null :
                                            <div>
                                                <Icon type="plus"/>
                                                <div className="ant-upload-text">点击上传</div>
                                            </div>
                                        }
                                    </Upload>
                                </FormItem>
                                <FormItem
                                    label='商品库存'
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <Input style={{maxWidth: 300}}
                                           value={this.state.productInfo.quantity === '' ? 0 : this.state.productInfo.quantity}/>
                                </FormItem>
                                <FormItem
                                    label='商品编号'
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <Input style={{maxWidth: 300}} value={this.state.productInfo.series_no}
                                           onChange={(e) => {
                                               this.inputField('productInfo', 'series_no', e.target.value)
                                           }}/>
                                </FormItem>
                                <FormItem
                                    label='商品类型'
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <Select style={{width: 140}} value={this.state.productInfo.category_id}
                                            onChange={(value) => {
                                                this.inputField('productInfo', 'category_id', value)
                                            }}>
                                        {
                                            this.state.typeList.map(item => {
                                                return <Select.Option key={item.id}
                                                                      value={item.id}>{item.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem
                                    label='商品规格'
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <Input style={{maxWidth: 300}} value={this.state.productInfo.specification}
                                           onChange={(e) => {
                                               this.inputField('productInfo', 'specification', e.target.value)
                                           }}/>
                                </FormItem>
                                <FormItem
                                    label='商品详情'
                                    labelCol={{span: 2}}
                                    wrapperCol={{span: 22}}
                                >
                                    <Input.TextArea style={{maxWidth: 300}} value={this.state.productInfo.description}
                                                    onChange={(e) => {
                                                        this.inputField('productInfo', 'description', e.target.value)
                                                    }}/>
                                </FormItem>
                            </Form>
                            <Button loading={this.state.isLoading} style={{marginLeft: '8.33333333%', marginTop: 10}}
                                    type="primary" onClick={this.handleSave}>保存</Button>
                        </div>
                    </Tabs.TabPane>
                    {
                        this.state.productInfo.id && <Tabs.TabPane key={'2'} tab={'价格管理'}>
                            {
                                this.state.priceList.length !== 0 && <div>
                                    <Switch checkedChildren="可编辑" unCheckedChildren="不可编辑" checked={this.state.priceEditAble}
                                            onChange={(value) => {
                                                this.setState({priceEditAble: value})
                                            }}/>
                                    {
                                        this.state.priceEditAble &&
                                        <Button type={"primary"} style={{marginLeft: 30}} loading={this.state.priceSaveLoading}
                                                onClick={this.handleSavePriceList}>保存</Button>
                                    }
                                </div>
                            }

                            <Button type={"primary"} onClick={() => {
                                this.setState({addPriceVisible: true})
                            }} style={{float: 'right'}}>新增</Button>
                            <div style={{marginTop: 50}}>
                                {this.state.priceLoading &&
                                <div style={{textAlign: 'center'}}><Spin size={"large"}/></div>}
                                {this.state.priceList.map((item, index) => {
                                    return (
                                        <div key={item.id}>
                                            <Form style={{marginBottom: 50}}>
                                                <FormItem
                                                    label='代理级别'
                                                    labelCol={{span: 2}}
                                                    wrapperCol={{span: 22}}
                                                >
                                                    <Input readOnly style={{maxWidth: 300}} value={item.level_name}/>
                                                </FormItem>
                                                <FormItem
                                                    label='价格'
                                                    labelCol={{span: 2}}
                                                    wrapperCol={{span: 22}}
                                                >
                                                    <Input style={{maxWidth: 300}} value={item.price} onChange={(e) => {
                                                        this.insertPriceField(index, 'price', e.target.value)
                                                    }}/>
                                                </FormItem>
                                                <FormItem
                                                    label='起批数量'
                                                    labelCol={{span: 2}}
                                                    wrapperCol={{span: 22}}
                                                >
                                                    <Input style={{maxWidth: 300}} value={item.batches}
                                                           onChange={(e) => {
                                                               this.insertPriceField(index, 'batches', e.target.value)
                                                           }}/>
                                                </FormItem>
                                                <FormItem
                                                    label='详细说明'
                                                    labelCol={{span: 2}}
                                                    wrapperCol={{span: 22}}
                                                >
                                                    <Input style={{maxWidth: 300}} value={item.description}
                                                           onChange={(e) => {
                                                               this.insertPriceField(index, 'description', e.target.value)
                                                           }}/>
                                                </FormItem>
                                                <Popconfirm title="确定要删除这个类别吗？" onConfirm={() => {
                                                    this.handleDeleteProduct(item.id)
                                                }} okText="是" cancelText="否">
                                                    <Button type={"danger"}
                                                            style={{marginLeft: '8.33333%', marginTop: 20}}>删除</Button>
                                                </Popconfirm>
                                            </Form>
                                            <Divider/>
                                        </div>
                                    )
                                })}
                            </div>
                        </Tabs.TabPane>
                    }
                    {
                        this.state.productInfo.id && <Tabs.TabPane key={'3'} tab={'库存管理'}>
                            <div style={{marginTop: 20}}>
                                <Button onClick={()=>{
                                    this.setState({
                                        addInventoryVisible: true,
                                        addInventoryForm: {
                                            changes: '',
                                            factory: '',
                                            memo: '',
                                            order_id: '',
                                            origin: '',
                                            price: '',
                                            product_id: this.state.productInfo.id,
                                            quantity: '',
                                        },
                                    })
                                }} style={{ marginLeft: 30 }} type={"primary"}>新增进出库记录</Button>
                                <Table rowKey={'id'} style={{margin: 30}} loading={this.state.inventoryLoading}
                                       dataSource={this.state.inventoryList} columns={this.inventoryColumns}
                                       pagination={{
                                           current: this.state.pageNum, onChange: (page) => {
                                               this.setState({
                                                   pageNum: page
                                               },()=>{
                                                   this.handleFetchInventoryList();
                                               })
                                           }
                                       }}/>
                            </div>
                        </Tabs.TabPane>
                    }

                </Tabs>


            </div>
        )
    }
}

export default ProductDetail