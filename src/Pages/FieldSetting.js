import { Button, Form, Input, Select } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const FieldSetting = () => {

    const [fieldList, setFieldList] = useState([])
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const handleExport = () => {
        const dict = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(fieldList)
          )}`;
        const link = document.createElement('a')
        link.href = dict
        link.download = 'export.json'
        link.click()
        setFieldList([])
    }

    return (
        <div className="m-3">
            <h1>Field Setting</h1>
            <Button onClick={() => {
                navigate('/home')
            }}>Home</Button>
            {
                fieldList.map((field) => {

                    return (
                        <div key={field.key}>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4>{field.key} --- {field.type} --- {field.value}</h4>
                                </div>
                                <Button onClick={() => {
                                    setFieldList(fieldList.filter(item => item.key !== field.key))
                                }}>Xóa</Button>
                            </div>
                        </div>
                    )
                })
            }
            <hr />
            <Form form={form} layout="horizontal" onFinish={(value) => {
                setFieldList([...fieldList, {
                    key: value.key,
                    type: value.type,
                    value: value.value
                }])
                form.resetFields()
            }}>
                <Form.Item
                    name='key'
                    label='Key'
                    rules={[
                        {
                            required: true,
                            message: 'Cần có',
                        },
                    ]}
                    style={{
                        display: 'inline-block',
                        width: '34%',
                        padding: 5
                    }}
                >
                    <Input></Input>
                </Form.Item>

                <Form.Item
                    name='type'
                    label='Loại'
                    style={{
                        display: 'inline-block',
                        width: '33%',
                        padding: 5
                    }}
                    rules={[
                        {
                            required: true,
                            message: 'Cần có',
                        },
                    ]}
                >
                    <Select
                        options={[
                            {
                                label: 'Có giá trị',
                                value: 'default'
                            },
                            {
                                label: 'Match với',
                                value: 'match'
                            }
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name='value'
                    label='Value'
                    rules={[
                        {
                            required: true,
                            message: 'Cần có',
                        },
                    ]}
                    style={{
                        display: 'inline-block',
                        width: '33%',
                        padding: 5
                    }}
                >
                    <Input></Input>
                </Form.Item>
                <Button htmlType="submit">Thêm trường</Button>
            </Form>
            <hr />
            <Button onClick={handleExport}>Export</Button>
        </div>
    )
}

export default FieldSetting