import { Button, List, Space, Input, Select } from 'antd'
import { useState } from 'react'

const { Option } = Select;

const options = [
    {
        label: 'Thêm vào tất cả các sản phẩm',
        value: 'all'
    },
    {
        label: 'Thêm vào một số sản phẩm',
        value: 'random'
    }
]

const TagManager = () => {

    const [tagList, setTagList] = useState([])
    const [tag, setTag] = useState()
    const [percent, setPercent] = useState(100)
    const [disable, setDisable] = useState(true)

    return (
        <>
            <hr />
            <h5>Cài đặt về Tag: </h5>
            <Space.Compact
                style={{
                    width: '100%'
                }}
            >
                <Input
                    addonBefore="Thêm những Tag" 
                    onChange={(value) => {
                        setTag(value.target.value)
                    }}
                />
                <Select
                    defaultValue='all'
                    options={options}
                    onChange={(value) => {
                        if(value === 'random') {
                            setDisable(false)
                        } else {
                            setDisable(true)
                            setPercent(100)
                        }
                    }}
                />
                <Input
                    disabled={disable}
                    addonBefore="Với tần suất" 
                    addonAfter="Phần trăm"
                    value={percent}
                    onChange={(value) => {
                        setPercent(value.target.value)
                    }}
                />
                <Button 
                    type="primary"
                    onClick={() => {
                        setTagList([...tagList, {
                            key: Date.now(),
                            data: tag,
                            percent: percent
                        }])
                    }}
                >Thêm</Button>
            </Space.Compact>
            <List
                bordered
                dataSource={tagList}
                style={{
                    marginTop: 10
                }}
                renderItem={(tag) => (
                    <List.Item
                        actions={[
                            <Button
                                type='primary'
                                ghost
                                onClick={() => {
                                    setTagList(tagList.filter(item => item.key !== tag.key))
                                }}
                            >
                                Xóa Tag
                            </Button>
                        ]}
                    >
                        <List.Item.Meta title={"Tag: " + tag.data + " - Xuất hiện ở " + tag.percent + "% sản phẩm trong file"} />
                    </List.Item>
                )}
            />
        </>
    )
}

export default TagManager