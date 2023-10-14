import { Button, List, Space, Input, message } from 'antd'
import { useEffect, useState } from 'react'
import duplicateInit from '../../Resources/duplicate.json'

const CopyManager = () => {

    const [duplicateList, setDuplicateList] = useState(duplicateInit)

    const [attributeName, setVariantName] = useState()
    const [variantValue, setVariantValue] = useState()

    useEffect(() => {
        localStorage.setItem('duplicates', JSON.stringify(duplicateList))
    }, [])

    const handleVariantList = (values) => {
        setDuplicateList(values)
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
                    addonBefore="Tên nhân bản"
                    addonAfter="Giá trị cộng thêm"
                    value={attributeName}
                    onChange={(value) => {
                        setVariantName(value.target.value)
                    }}
                />
                <Input
                    value={variantValue}
                    addonAfter='USD'
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
                            handleVariantList([...duplicateList, {
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
                dataSource={duplicateList}
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
                                            handleVariantList(duplicateList.filter(item => item.key !== variant.key))
                                        }}
                                    >
                                        Xóa
                                    </Button>
                                </Space>
                            ]}
                        >
                            <List.Item.Meta
                                title={variant.data.name}
                                description={'Giá: +' + variant.data.value}
                            />
                        </List.Item>
                    )
                }}
            />
        </>
    )
}

export default CopyManager