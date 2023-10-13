import { Button, List, Space, Input, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import TagInit from '../../Resources/tag.json'

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

    const [tagList, setTagList] = useState(TagInit)
    const [tag, setTag] = useState(null)
    const [percent, setPercent] = useState(100)
    const [disable, setDisable] = useState(true)

    useEffect(() => {
        localStorage.setItem('tags', JSON.stringify(tagList))
    }, [])

    const handleTagList = (values) => {
        setTagList(values)
        localStorage.setItem('tags', JSON.stringify(values))

        setTag(null)
        setPercent(100)
        setDisable(true)
    }

    return (
        <>
            <hr />
            <h5>Cài đặt Tag: </h5>
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
                    value={tag}
                />
                <Select
                    options={options}
                    onChange={(value) => {
                        if(value === 'random') {
                            setDisable(false)
                        } else {
                            setDisable(true)
                            setPercent(100)
                        }
                    }}
                    value={options[0]}
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
                        if(tag !== null && percent !== null) {
                            handleTagList([...tagList, {
                                key: Date.now() % 1000000,
                                data: tag,
                                percent: Number(percent)
                            }])
                        } else {
                            message.error("Tag and Tag Percent can not be blank")
                        }
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
                                    handleTagList(tagList.filter(item => item.key !== tag.key))
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