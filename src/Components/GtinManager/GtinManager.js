import { useEffect, useState } from "react"
import { Input } from 'antd'

const GtinManager = () => {

    const [value, setValue] = useState('Handmade')

    useEffect(() => {
        localStorage.setItem('gtin', value)
    }, [value, setValue])

    return (
        <>
            <hr />
            <h5 style={{ color: 'red' }}>Cài đặt Gtin: </h5>
            <Input 
                addonBefore='_wc_gla_gtin' defaultValue={value} 
                onChange={(value) => {
                    if(value.target.value) {
                        setValue(value.target.value)
                    } else {
                        setValue('Handmade')
                    }
                }}
            />
        </>
    )
}

export default GtinManager