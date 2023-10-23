import { Space, Button, Form, Input, Table, Popconfirm, message} from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ProductAdd = () => {

    const navigate = useNavigate()
    const [form] = Form.useForm()



    const [productList, setProductList] = useState([])

    const Export = () => {

        if(productList.length < 1) {
            message.error('Product List can not be null')
            return
        }

        let csvContent = "data:text/csv;charset=utf-8,\"Product Name\",\"Product Image File - 1\"\n"
        productList.forEach(product => {
            csvContent = csvContent + "\"" + product.name + "\"" + "," + "\"" + product.image + "\"" + "\n"
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
            width: '45%',
        },
        {
            title: 'Link',
            dataIndex: 'image',
            key: 'image',
            width: '50%',
        },
        {
            title: 'Action',
            key: 'action',
            width: '5%',
            render: (item) => (
                <Space>
                    <Button type='primary' ghost danger
                        onClick={() => {
                            setProductList(productList.filter(product => product.key !== item.key))
                        }}
                    >Delete</Button>
                </Space>
            )
        }
    ]

    return (
        <div className="m-3">
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
            <Table columns={columns} dataSource={productList} />
            <hr />
            <Form
                form={form}
                layout='vertical'
                onFinish={(value) => {
                    setProductList([...productList, {
                        key: Date.now(),
                        name: value.name,
                        image: value.image,
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

                <Button type='primary' htmlType='submit'>Thêm</Button>
            </Form>
        </div>
    )
}

export default ProductAdd