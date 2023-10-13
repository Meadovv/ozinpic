import { Button, List, Space, Input, message, Form, Modal } from 'antd'
import { useEffect, useState } from 'react'
import variantInit from '../../Resources/variant.json'

const SettingModal = ({ variant, open, onSave, onCancel }) => {

    const [form] = Form.useForm()
    const values = variant.data.value.split(',')

    return (
        <Modal
            open={open}
            title='Chỉnh sửa giá'
            okText='Xác nhận'
            cancelText='Đóng'
            onCancel={() => {
                form.resetFields()
                onCancel()
            }}
            onOk={() => {
                onSave(form.getFieldValue())
                form.resetFields()
            }}
        >
            <Form
                form={form}
                layout='vertical'
            >
                {
                    values.map((_, index) => {

                        return (
                            <Form.Item
                                key={index}
                                name={index}
                                rules={[{ required: true, message: 'Cần có' }]}
                            >
                                <Input
                                    addonBefore={values[index]}
                                    addonAfter='USD'
                                    placeholder={variant.data.setting[index]}
                                />
                            </Form.Item>
                        )
                    })
                }
            </Form>
        </Modal>
    )
}

const VariantManager = () => {

    const [variantList, setVariantList] = useState(variantInit)

    const [variantName, setVariantName] = useState()
    const [variantValue, setVariantValue] = useState()
    const [totalVariant, setTotalVariant] = useState(6)

    const [modal, setModal] = useState(false)
    const [variant, setVariant] = useState(variantList[0]) // display in modal
    const [id, setId] = useState(0)

    useEffect(() => {
        localStorage.setItem('variants', JSON.stringify(variantList))
    }, [])

    const handleVariantList = (values) => {
        setVariantList(values)
        let total = 1
        values.forEach((variant) => {
            total = total * variant.data.value.split(',').length
        })
        setTotalVariant(total)
        localStorage.setItem('variants', JSON.stringify(values))

        setVariantName(null)
        setVariantValue(null)
    }

    const onSave = (value) => {
        setModal(false)
        if(!(Object.keys(value).length === 0)) {
            Object.keys(value).forEach(key => {
                variantList[id].data.setting[key] = Number(value[key])
            })

            handleVariantList(variantList)

        }
    }

    return (
        <>
            <SettingModal
                open={modal}
                onSave={onSave}
                onCancel={() => {
                    setModal(false)
                }}
                variant={variant}
            />
            <hr />
            <h5>Cài đặt Variant: </h5>
            <Space.Compact
                style={{
                    width: '100%'
                }}
            >
                <Input
                    addonBefore="Variant Name"
                    addonAfter="Với các giá trị (Cách nhau bởi dấu phẩy)"
                    value={variantName}
                    onChange={(value) => {
                        setVariantName(value.target.value)
                    }}
                />
                <Input
                    value={variantValue}
                    onChange={(value) => {
                        setVariantValue(value.target.value)
                    }}
                />
                <Button
                    type="primary"
                    onClick={() => {

                        let settingArr = []
                        variantValue.split(',').forEach((_, index) => {
                            settingArr.push(0)
                        })

                        if (variantName !== null && variantValue) {
                            handleVariantList([...variantList, {
                                key: Date.now() % 1000000,
                                data: {
                                    name: variantName,
                                    value: variantValue,
                                    setting: settingArr,
                                }
                            }])
                        } else {
                            message.error('Variant Name and Variant Value can not be blank')
                        }
                    }}
                >Thêm</Button>
            </Space.Compact>
            <List
                bordered
                dataSource={variantList}
                style={{
                    marginTop: 10
                }}
                renderItem={(variant, index) => {

                    let settingLabel = ""
                    variant.data.setting.forEach(setting => {
                        settingLabel = settingLabel + " + " + setting + ","
                    })

                    return (
                        <List.Item
                            actions={[
                                <Space>
                                    <Button
                                        type='primary'
                                        ghost
                                        onClick={() => {
                                            setId(index)
                                            setVariant(variant)
                                            setModal(true)
                                        }}
                                    >
                                        Chỉnh sửa giá
                                    </Button>
                                    <Button
                                        type='primary'
                                        ghost
                                        danger
                                        onClick={() => {
                                            handleVariantList(variantList.filter(item => item.key !== variant.key))
                                        }}
                                    >
                                        Xóa Variant
                                    </Button>
                                </Space>
                            ]}
                        >
                            <List.Item.Meta
                                title={variant.data.name + ": " + variant.data.value}
                                description={"Setting: " + settingLabel}
                            />
                        </List.Item>
                    )
                }}
            />
            <h5 className='mt-3'>Có tất cả {totalVariant} Variant</h5>
        </>
    )
}

export default VariantManager