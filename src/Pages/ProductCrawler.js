import { useNavigate } from "react-router-dom"
import { Button, Space, Input, Select, message } from 'antd'
import { useState } from "react"

const ProductCrawler = () => {

    const navigate = useNavigate()
    const webData = [
        {
            label: 'Red Bubble',
            value: 'red-bubble'
        },
        {
            label: 'Tee Public',
            value: 'tee-public'
        }
    ]

    const [loading, setLoading] = useState(false)
    const [webLink, setWebLink] = useState(webData[0].value)
    const [keyword, setKeyword] = useState()

    const handleCheck = async () => {

        if(!keyword) {
            message.error('Nhập từ khóa trước')
            return
        }

        setLoading(true)

        setLoading(false)
    }

    return (
        <div className="m-3">
            <h1>Product Crawler</h1>
            <Space>
                <Button onClick={() => {
                    navigate('/')
                }}>Home</Button>
            </Space>
            <hr />
            <Space.Compact
                style={{
                    width: '100%'
                }}
            >
                <Input
                    addonBefore='Nhập từ khóa'
                    onChange={(value) => {
                        setKeyword(value.target.value)
                    }}
                />
                <Select
                    options={webData}
                    defaultValue={webData[0]}
                    onChange={(value) => {
                        setWebLink(value.value)
                    }}
                />
            </Space.Compact>
            <Button
                className="mt-3"
                loading={loading}
                onClick={handleCheck}
            >Kiểm tra</Button>
        </div>
    )
}

export default ProductCrawler