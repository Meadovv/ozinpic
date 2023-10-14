import { useNavigate } from "react-router-dom"
import { Button, Space, Input, Select } from 'antd'
import { useState } from "react"
import axios from "axios"

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

    const [allowCrawl, setAllowCrawl] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleCheck = async () => {

        // let config = {
        //     headers: {
        //         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        //         'Connection': 'keep-alive',
        //         'Accept-Encoding': 'gzip, deflate, br',
        //         'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.47',
        //     },
        //     params: {
        //         'page': 1,
        //         'query': 'Avenger%20Tshirt'
        //     }
        // }

        setLoading(true)
        // axios.get('https://www.redbubble.com/shop/', config)
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
        setLoading(false)
    }

    const handleCrawl = () => {

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
                />
                <Select
                    options={webData}
                    defaultValue={webData[0]}
                />
            </Space.Compact>
            <Space className="mt-3">
                <Button
                    loading={loading}
                    onClick={handleCheck}
                >Kiểm tra</Button>
                <Button
                    disabled={!allowCrawl}
                    onClick={handleCrawl}
                >CRAWL</Button>
            </Space>
        </div>
    )
}

export default ProductCrawler