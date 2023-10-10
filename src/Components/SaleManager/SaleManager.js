import { Checkbox, Input } from "antd"
import { useEffect, useState } from "react";

const SaleManager = () => {

    const [sale, setSale] = useState(false)
    const [sameCost, setSameCost] = useState(false)

    useEffect(() => {
        localStorage.setItem('sale', 0)
        localStorage.setItem('sameCost', 0)
    }, [])

    const handleSale = (value) => {
        setSale(value.target.checked)
        localStorage.setItem('sale', 0)
    }

    const handleSameCost = (value) => {
        setSameCost(value.target.checked)
        localStorage.setItem('sameCost', 0)
    }

    return (
        <>
            <hr />
            <h5>Cài đặt giá:</h5>
            <Checkbox
                onChange={handleSale}
            >Giảm giá tất cả sản phẩm</Checkbox>
            <div className="mt-3" hidden={sale ? '' : 'hidden'}>
                <Input
                    addonBefore="Giảm giá"
                    addonAfter="% so với giá gốc"
                    defaultValue={0}
                    onChange={(value) => {
                        localStorage.setItem('sale', value.target.value)
                    }}
                />
            </div>
            <div className="mt-3">
                <Checkbox
                    onChange={handleSameCost}
                    className="mb-2"
                >Đặt tất cả sản phẩm về một giá</Checkbox>
            </div>
            <div className="mt-1" hidden={sameCost ? '' : 'hidden'}>
                <Input
                    addonBefore="Giá mới"
                    addonAfter="USD" defaultValue={0}
                    onChange={(value) => {
                        localStorage.setItem('sameCost', value.target.value)
                    }}
                />
            </div>
        </>
    )
}

export default SaleManager