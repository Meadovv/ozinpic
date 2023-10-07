import { Select } from "antd"
const options = [
    {
        label: 'S',
        value: 'S'
    },
    {
        label: 'M',
        value: 'M'
    },
    {
        label: 'L',
        value: 'L'
    },
    {
        label: 'XL',
        value: 'XL'
    },
    {
        label: '2XL',
        value: '2XL'
    },
    {
        label: '3XL',
        value: '3XL'
    }
]

const SizeManager = () => {

    const handleChange = (values) => {
        console.log(values)
    }

    return (
        <>
            <hr />
            <h5>Chọn size: </h5>
            <Select
                mode="multiple"
                allowClear
                style={{
                    width: '100%'
                }}
                placeholder="Please Select"
                defaultValue={options}
                onChange={handleChange}
                options={options}
            />
        </>
    )
}

export default SizeManager