import { Space, Input, Button, message } from "antd"
import { useState } from "react"

const CategoryManager = () => {

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
                        localStorage.setItem('category', value.target.value)
                    }}
                />
                <Input 
                    addonBefore="Category Code" 
                    onChange={(value) => {
                        localStorage.setItem('categoryCode', value.target.value)
                    }}
                />
            </Space.Compact>
        </>
    )
}

export default CategoryManager