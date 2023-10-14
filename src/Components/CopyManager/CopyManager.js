import { Button, List, Space, Input, message } from 'antd'
import { useEffect, useState } from 'react'
import attributeInit from '../../Resources/attribute.json'

const CopyManager = () => {

    const [attributeList, setVariantList] = useState(attributeInit)

    const [attributeName, setVariantName] = useState()
    const [variantValue, setVariantValue] = useState()

    useEffect(() => {
        localStorage.setItem('duplicates', JSON.stringify(attributeList))
    }, [])

    const handleVariantList = (values) => {
        setVariantList(values)
        localStorage.setItem('duplicates', JSON.stringify(values))

        setVariantName(null)
        setVariantValue(null)
    }

    return (
        <>
            <hr />
            <h5>Cài đặt Nhân bản: </h5>
            <Space.Compact
                style={{
                    width: '100%'
                }}
            >
                <Input
                    addonBefore="Attribute Name"
                    addonAfter="Với giá trị"
                    value={attributeName}
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

                        if (attributeName !== null && variantValue) {
                            handleVariantList([...attributeList, {
                                key: Date.now() % 1000000,
                                data: {
                                    name: attributeName,
                                    value: variantValue
                                }
                            }])
                        } else {
                            message.error('Attribute Name and Attribute Value can not be blank')
                        }
                    }}
                >Thêm</Button>
            </Space.Compact>
            <List
                bordered
                dataSource={attributeList}
                style={{
                    marginTop: 10
                }}
                renderItem={(variant, index) => {

                    return (
                        <List.Item
                            actions={[
                                <Space>
                                    <Button
                                        type='primary'
                                        ghost
                                        danger
                                        onClick={() => {
                                            handleVariantList(attributeList.filter(item => item.key !== variant.key))
                                        }}
                                    >
                                        Xóa Attribute
                                    </Button>
                                </Space>
                            ]}
                        >
                            <List.Item.Meta
                                title={variant.data.name + ": " + variant.data.value}
                            />
                        </List.Item>
                    )
                }}
            />
        </>
    )
}

export default CopyManager