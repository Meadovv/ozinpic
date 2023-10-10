import { Button, List, Space, Input, message } from 'antd'
import { useEffect, useState } from 'react'

const VariantManager = () => {

    const [variantList, setVariantList] = useState([
        {
            key: 0,
            data: {
                name: 'Sizes',
                value: 'S,M,L,XL,2XL,3XL'
            }
        },
        {
            key: 1,
            data: {
                name: 'Style',
                value: 'T-shirt,Long Sleeve,Tank Top,Sweatshirt,Hoodie,Women T-shirt'
            }
        }
    ])
    const [variantName, setVariantName] = useState()
    const [variantValue, setVariantValue] = useState()
    const [totalVariant, setTotalVariant] = useState(1)

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

    return (
        <>
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
                        if(variantName !== null && variantValue) {
                            handleVariantList([...variantList, {
                                key: Date.now() % 1000000,
                                data: {
                                    name: variantName,
                                    value: variantValue
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
                renderItem={(variant) => (
                    <List.Item
                        actions={[
                            <Button
                                type='primary'
                                ghost
                                onClick={() => {
                                    handleVariantList(variantList.filter(item => item.key !== variant.key))
                                }}
                            >
                                Xóa Variant
                            </Button>
                        ]}
                    >
                        <List.Item.Meta title={variant.data.name + ": " + variant.data.value} />
                    </List.Item>
                )}
            />
            <h5 className='mt-3'>Có tất cả {totalVariant} Variant</h5>
        </>
    )
}

export default VariantManager