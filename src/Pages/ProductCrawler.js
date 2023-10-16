import { useNavigate } from "react-router-dom"
import { Button, Select, Space, Upload, List, Card, message, Checkbox, Modal, Form, Input } from 'antd'
import { UploadOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import axios from "axios";

function getName(name) {

    name = name.replace(/['"]+/g, '')
    name = name.replace('T-Shirt', '')
    name = name.replace('T-shirt', '')
    name = name.replace('Hoodie', '')
    name = name.replace('Sweatshirt', '')
    name = name.replace('Unisex', '')
    name = name.replace(/[0-9]+/g, '');
    name = name.replace(/[^a-zA-Z0-9 ]/g, '')

    name = name.replace(/\s{2,}/g, ' ').trim()

    return name
}

const webSelection = [
    {
        label: 'Red Bubble',
        value: 'red-bubble'
    },
    {
        label: 'Amazon',
        value: 'amazon'
    }
]

const SettingModal = ({ data, open, onSave, onCancel }) => {

    const [form] = Form.useForm()

    return (
        <Modal
            width={1200}
            open={open}
            title='Chỉnh sửa thông tin'
            onOk={() => {

                onSave({
                    id: data.key,
                    value: form.getFieldValue()
                })
                form.resetFields()
            }}
            onCancel={() => {
                form.resetFields()
                onCancel()
            }}
            okText='Lưu lại'
            cancelText='Đóng'
        >
            <Form
                form={form}
                layout="vertical"
            >
                <h4>Link sản phẩm: <a href={data.link} target="_blank">{data.name}</a></h4>

                <Form.Item
                    label={'[Mặc định] ' + data.name}
                    name='name'
                >
                    <Input
                        addonBefore={'Tên'}
                    />
                </Form.Item>

                <Form.Item
                    label={'[Mặc định] ' + data.image.link}
                    name='image'
                >
                    <Input
                        addonBefore={'Hình ảnh'}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const ProductCrawler = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [web, setWeb] = useState(webSelection[0].value)
    const [file, setFile] = useState(null)
    const [productList, setProductList] = useState([])

    useEffect(() => {
        if (localStorage.getItem('data')) {
            setProductList(JSON.parse(localStorage.getItem('data')))
        }
    }, [])

    // Modal

    const [openModal, setOpenModal] = useState(false)
    const [product, setProduct] = useState({
        link: 'null',
        name: 'null',
        image: 'null'
    })

    const onSave = (data) => {
        if(data.value.name) {
            productList[data.id - 1].name = data.value.name
        }
        if(data.value.image) {
            productList[data.id - 1].image.link = data.value.image
        }
        setOpenModal(false)
    }

    const onCancel = () => {
        setOpenModal(false)
    }

    const parse = async () => {
        setLoading(true)
        await axios.post('http://localhost:8000/get', {
            website: web,
            html: file
        }).then(response => {
            if (response.data.success === 'true') {
                message.success('Total: ' + response.data.product.total)
                setProductList(response.data.product.list)
                localStorage.setItem('data', JSON.stringify(response.data.product.list))
            } else {
                message.error(response.message)
            }
        }).catch(err => {
            console.log(err)
            message.error(err.message)
        })
        setLoading(false)
    }
    
    const exportList = () => {

        setProductList(JSON.parse(localStorage.getItem('data')))

        let csvArr = []
        let csvRow = []
        csvRow.push('Product Name')
        csvRow.push('Product Image File - 1')
        csvRow.push('Link')

        csvArr.push(csvRow)

        productList.forEach(product => {
            csvRow = []

            csvRow.push(getName(product.name))
            csvRow.push(product.image.link)
            csvRow.push(product.link)

            csvArr.push(csvRow)
        })
        
        let csvContent = "data:text/csv;charset=utf-8,"
        let rowContent = '';

        csvArr.forEach(row => {
            rowContent = '';
            row.forEach(item => {
                rowContent = rowContent + "\"" + item + "\"" + ","
            })
            csvContent = csvContent + rowContent + "\n"
        })

        const link = document.createElement('a')
        link.href = csvContent
        link.download = 'export-crawl.csv'
        link.click()
    }

    return (
        <div className="m-3">
            <SettingModal
                data={product}
                open={openModal}
                onSave={onSave}
                onCancel={onCancel}
            />
            <h1>Product Crawler</h1>
            <Space>
                <Button
                    onClick={() => {
                        navigate('/')
                    }}
                >Home</Button>

                <Button
                    onClick={() => {
                        localStorage.clear()
                        window.location.reload()
                    }}
                    danger
                    ghost
                >Clear Cache</Button>

                <Upload
                    beforeUpload={(file) => {
                        const fileReader = new FileReader()
                        fileReader.readAsText(file)
                        fileReader.onload = (e) => {
                            setFile(e.target.result)
                        }
                        return false
                    }}
                    showUploadList={false}
                >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>

                <Select
                    defaultValue={webSelection[0].value}
                    options={webSelection}
                    onChange={(value) => {
                        setWeb(value)
                    }}
                />

                <Button
                    loading={loading}
                    disabled={file === null}
                    onClick={parse}
                >Crawl</Button>

                <Button
                    icon={<DownloadOutlined />}
                    onClick={() => {
                        localStorage.setItem('data', JSON.stringify(productList))
                    }}
                >
                    Lưu Cache
                </Button>

                <Button
                    type="primary"
                    ghost
                    onClick={exportList}
                >
                    Export
                </Button>
            </Space>
            <hr />
            <List
                grid={{
                    gutter: 16,
                    column: 4,
                }}
                dataSource={productList}
                renderItem={(item) => {

                    let name = item.name;
                    if (name.length > 30) {
                        name = name.slice(0, 30) + "..."
                    }

                    return (
                        <List.Item>
                            <Card
                                style={{
                                    width: 450
                                }}
                                cover={<img alt={item.image.alt} src={item.image.link} />}
                            >
                                <Space>
                                    <Checkbox defaultChecked={item.add === 1} onChange={(value) => {
                                        if(value.target.checked) item.add = 1
                                        else item.add = 0
                                    }}></Checkbox>
                                    <Card.Meta title={name} />
                                    <Button icon={<EditOutlined />} onClick={() => {
                                        setProduct(item)
                                        setOpenModal(true)
                                    }}>Edit</Button>
                                </Space>
                            </Card>
                        </List.Item>
                    )
                }}
            />
        </div>
    )
}

export default ProductCrawler