import { Space, Input} from "antd"
import { useEffect } from "react"

const CategoryManager = () => {

    useEffect(() => {
        localStorage.setItem('category', 'Clothing')
        localStorage.setItem('categoryCode', 'CL')
    }, [])

    return (
        <>
            <hr />
            <h5>Cài đặt Category: </h5>
            <Space.Compact
                style={{
                    width: '100%'
                }}
            >
                <Input 
                    addonBefore="Category" 
                    onChange={(value) => {
                        if(value.target.value) {
                            localStorage.setItem('category', value.target.value)
                        } else {
                            localStorage.setItem('category', 'clothing')
                        }
                    }}
                />
                <Input 
                    addonBefore="Category Code" 
                    onChange={(value) => {
                        if(value.target.value) {
                            localStorage.setItem('categoryCode', value.target.value)
                        } else {
                            localStorage.setItem('categoryCode', 'CL')
                        }
                    }}
                />
            </Space.Compact>
        </>
    )
}

export default CategoryManager