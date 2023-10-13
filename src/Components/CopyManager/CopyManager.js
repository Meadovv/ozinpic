import { Input } from 'antd'
import { useEffect, useState } from 'react'

const CopyManager = () => {

    const [value, setValue] = useState('Tshirt,Sweatshirt,Hoodie');

    useEffect(() => {
        localStorage.setItem('copy', value)
    }, [value, setValue])

    return (
        <>
            <hr />
            <h5 style={{ color: 'red' }}>Cài đặt Nhân bản: </h5>
            <Input 
                addonBefore='Các nhân bản (Cách nhau bởi dấu phẩy):' defaultValue={value} 
                onChange={(value) => {
                    if(value.target.value) {
                        setValue(value.target.value)
                    } else {
                        setValue('Tshirt,Sweatshirt,Hoodie')
                    }
                }}
            />
        </>
    )
}

export default CopyManager