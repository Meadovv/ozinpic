import { Space, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const ProductAdd = () => {

    const navigate = useNavigate()

    return (
        <div className="m-3">
            <h1>Product Crawler</h1>
            <Space>
                <Button
                    onClick={() => {
                        navigate('/')
                    }}
                >Home</Button>
            </Space>
        </div>
    )
}

export default ProductAdd