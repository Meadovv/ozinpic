import { InputNumber, Checkbox } from "antd"
import { useState } from "react";

const SaleManager = () => {

    const [sale, setSale] = useState(false)
    const [sameCost, setSameCost] = useState(false)

    const handleSale = (value) => {
        setSale(value.target.checked)
    }

    const handleSameCost = (value) => {
        setSameCost(value.target.checked)
    }

    return (
        <>
            <hr />
            <h5>Cài đặt về giá:</h5>
            <Checkbox
                onChange={handleSale}
            >Giảm giá tất cả sản phẩm</Checkbox>
            <div className="mt-3" hidden={sale ? '' : 'hidden'}>
                <InputNumber addonBefore="Giảm giá" addonAfter="% so với giá gốc" defaultValue={10} />
            </div>
            <div className="mt-3">
                <Checkbox
                    onChange={handleSameCost}
                    className="mb-2"
                >Đặt tất cả sản phẩm về một giá</Checkbox>
            </div>
            <div className="mt-1" hidden={sameCost ? '' : 'hidden'}>
                <InputNumber addonBefore="Giá mới" addonAfter="USD" defaultValue={100} />
            </div>
        </>
    )
}

export default SaleManager