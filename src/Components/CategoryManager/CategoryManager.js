import { Space, Input} from "antd"
import { useEffect, useState } from "react"

const CategoryManager = () => {

    const [category, setCategory] = useState('Clothing')
    const [categoryCode, setCategoryCode] = useState('CL')

    useEffect(() => {
        localStorage.setItem('category', category)
        localStorage.setItem('categoryCode', categoryCode)
    }, [category, categoryCode, setCategory, setCategoryCode])

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
                    defaultValue={category}
                    onChange={(value) => {
                        if(value.target.value) {
                            setCategory(value.target.value)
                        } else {
                            setCategory('Clothing')
                        }
                    }}
                />
                <Input 
                    addonBefore="Category Code" 
                    defaultValue={categoryCode}
                    onChange={(value) => {
                        if(value.target.value) {
                            setCategoryCode(value.target.value)
                        } else {
                            setCategoryCode('CL')
                        }
                    }}
                />
            </Space.Compact>
        </>
    )
}

export default CategoryManager