import { Space, Button, Form, Input, Table, Popconfirm, message, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ProductAdd = () => {

    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [modalForm] = Form.useForm()
    const [productList, setProductList] = useState([])

    const Export = () => {

        if (productList.length < 1) {
            message.error('Product List can not be null')
            return
        }

        let csvContent = "data:text/csv;charset=utf-8,Product Name,Description,Product Image File - 1,Ozinpic\n"
        productList.forEach(product => {
            csvContent = csvContent + product.name + "," + product.description + "," + product.image + ",Ozinpic\n"
        })

        const link = document.createElement('a')
        link.href = csvContent
        link.download = 'ozinpic-origin'
        link.click()
    }

    useEffect(() => {
        localStorage.setItem('data', JSON.stringify(productList))
    }, [productList, setProductList])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
        },
        {
            title: 'Link',
            dataIndex: 'image',
            key: 'image',
            width: '30%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (item) => (
                <Space>
                    <Button type='primary' ghost danger
                        onClick={() => {
                            setProductList(productList.filter(product => product.key !== item.key))
                        }}
                    >Delete</Button>
                    <Button type='primary' ghost
                        onClick={() => {
                            modalForm.setFieldValue('key', item.key)
                            modalForm.setFieldValue('name', item.name)
                            modalForm.setFieldValue('image', item.image)
                            modalForm.setFieldValue('description', item.description)
                            openModal()
                        }}
                    >Edit</Button>
                </Space>
            )
        }
    ]

    const [modalStatus, setModalStatus] = useState(false);

    const openModal = () => {
        setModalStatus(true)
    }

    const closeModal = () => {
        setModalStatus(false)
    }

    const onCreate = (values) => {
        let index = -1;
        productList.forEach((product, i) => {
            if(product.key === values.key) index = i;
        })

        if(index > -1) {
            let backupArr = [...productList]
            backupArr[index] = values
            setProductList(backupArr)
        }
    }

    return (
        <div className="m-3">
            <Modal
                width={1200}
                title="EDIT CONTENT"
                open={modalStatus}
                onOk={() => {
                    modalForm.validateFields()
                        .then((values) => {
                            form.resetFields()
                            onCreate(values)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                        closeModal()
                }}
                onCancel={closeModal}
            >
                <Form
                    form={modalForm}
                    layout='vertical'
                >
                    <Form.Item
                        name='key'
                        label='Key'
                        hidden
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        name='name'
                        label='Name'
                        rules={[
                            {
                                required: true,
                                message: 'Cần có',
                            },
                        ]}
                        style={{
                            display: 'inline-block',
                            width: '50%',
                            padding: 5
                        }}
                    >
                        <Input></Input>
                    </Form.Item>

                    <Form.Item
                        name='image'
                        label='Image'
                        rules={[
                            {
                                required: true,
                                message: 'Cần có',
                            },
                        ]}
                        style={{
                            display: 'inline-block',
                            width: '50%',
                            padding: 5
                        }}
                    >
                        <Input></Input>
                    </Form.Item>

                    <Form.Item
                        name='description'
                        label='Description'
                        rules={[
                            {
                                required: true,
                                message: 'Cần có',
                            },
                        ]}
                        style={{
                            display: 'inline-block',
                            width: '100%',
                            padding: 5
                        }}
                    >
                        <Input.TextArea></Input.TextArea>
                    </Form.Item>
                </Form>
            </Modal>
            <h1>Product Add</h1>
            <Space>
                <Button
                    onClick={() => {
                        navigate('/')
                    }}
                >Home</Button>
                <Popconfirm
                    title="Export to CSV"
                    description="Once you click YES, a CSV file will be downloaded to your computer named 'ozinpic-origin.csv'"
                    onConfirm={Export}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type='primary' ghost>Export</Button>
                </Popconfirm>
            </Space>
            <hr />
            <Table
                columns={columns}
                dataSource={productList}
            />
            <hr />
            <Form
                form={form}
                layout='vertical'
                onFinish={(value) => {
                    setProductList([...productList, {
                        key: Date.now(),
                        name: value.name,
                        image: value.image,
                        description: value.description,
                    }])
                    form.resetFields()
                }}
            >
                <Form.Item
                    name='name'
                    label='Name'
                    rules={[
                        {
                            required: true,
                            message: 'Cần có',
                        },
                    ]}
                    style={{
                        display: 'inline-block',
                        width: '50%',
                        padding: 5
                    }}
                >
                    <Input></Input>
                </Form.Item>

                <Form.Item
                    name='image'
                    label='Image'
                    rules={[
                        {
                            required: true,
                            message: 'Cần có',
                        },
                    ]}
                    style={{
                        display: 'inline-block',
                        width: '50%',
                        padding: 5
                    }}
                >
                    <Input></Input>
                </Form.Item>

                <Form.Item
                    name='description'
                    label='Description'
                    rules={[
                        {
                            required: true,
                            message: 'Cần có',
                        },
                    ]}
                    style={{
                        display: 'inline-block',
                        width: '100%',
                        padding: 5
                    }}
                >
                    <Input.TextArea></Input.TextArea>
                </Form.Item>

                <Button type='primary' htmlType='submit'>Add</Button>
            </Form>
        </div>
    )
}

export default ProductAdd