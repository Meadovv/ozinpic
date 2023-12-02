import { useEffect, useState } from "react"
import { Input, Space } from 'antd'

const SKU = () => {

    const [date, setDate] = useState("YYYYMMDD")
    const [count, setCount] = useState("0")

    useEffect(() => {
        localStorage.setItem('sku-code', date + "-" + count)
    }, [date, count])

    return (
        <>
            <hr />
            <h5 style={{ color: 'red' }}>Cài đặt SKU: </h5>
            <Space.Compact style={{
                width: '100%'
            }}>
                <Input
                    addonBefore='Ngày nhập' defaultValue={date}
                    onChange={(value) => {
                        if (value.target.value) {
                            setDate(value.target.value)
                        } else {
                            setDate('YYYYMMDD')
                        }
                    }}
                />
                <Input
                    addonBefore='Lần nhập' defaultValue={count}
                    onChange={(value) => {
                        if (value.target.value) {
                            setCount(value.target.value)
                        } else {
                            setCount('0')
                        }
                    }}
                />
            </Space.Compact>
        </>
    )
}

export default SKU