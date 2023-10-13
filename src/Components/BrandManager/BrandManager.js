import { useEffect, useState } from "react"
import { Input } from 'antd'

const BrandManager = () => {

    const [value, setValue] = useState('Ozinpic')

    useEffect(() => {
        localStorage.setItem('brand', value)
    }, [value, setValue])

    return (
        <>
            <hr />
            <h5 style={{ color: 'red' }}>Cài đặt Brand GMC: </h5>
            <Input 
                addonBefore='_wc_gla_brand' defaultValue={value} 
                onChange={(value) => {
                    if(value.target.value) {
                        setValue(value.target.value)
                    } else {
                        setValue('Ozinpic')
                    }
                }}
            />
        </>
    )
}

export default BrandManager