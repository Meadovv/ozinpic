import { Button, Space } from "antd"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate()
    
    return (
        <div className='m-3'>
            <h1>Chào mừng trở lại</h1>
            <div>
                <Space direction="horizontal">
                    <Button onClick={() => {
                        navigate('/product-generator')
                    }}>Product Generator</Button>
                    <Button onClick={() => 
                        navigate('/product-crawler')
                    }>Product Crawler</Button>
                </Space>
            </div>
        </div>
    )
}

export default Home