import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Button, Space, Input, Divider, Form, Checkbox, Upload, message } from 'antd'
import { UploadOutlined, SettingOutlined, HomeOutlined, DownloadOutlined } from '@ant-design/icons'

const TextReplacement = () => {

    const navigate = useNavigate()

    const [queries, setQuery] = useState([])

    const [editMode, setEditMode] = useState(-1)

    const exportQueryList = () => {
        const link = document.createElement('a')
        link.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(queries))
        link.download = 'template.json'
        link.click()
    }

    const importQueryList = (file) => {
        setLoading(true)
        const fileReader = new FileReader();

        fileReader.readAsText(file)

        fileReader.onload = (e) => {
            const fileData = e.target.result
            try {
                const jsonData = JSON.parse(fileData)
                setQuery(jsonData)
            } catch (e) {
                message.error('File is error')
            }
        }
        setLoading(false)
    }

    const [current, setCurrent] = useState({
        findBy: '',
        replaceBy: ''
    })

    const [file, setFile] = useState(null)

    const [loading, setLoading] = useState(false)

    const handleFile = () => {
        if (!file) return
        setLoading(true)
        const fileReader = new FileReader();

        fileReader.readAsText(file)

        fileReader.onload = (e) => {
            const fileData = e.target.result
            try {
                localStorage.setItem('data', fileData)
            } catch (e) {
                message.error('File is error')
            }
        }
        setLoading(false)
    }

    const Execute = () => {
        console.log(queries)
        if (!localStorage.getItem('data')) {
            message.error('Please upload a file')
            return
        }
        try {
            let data = localStorage.getItem('data')

            queries.forEach(query => {
                if (query.replaceBy === undefined) {
                    query.replaceBy = ''
                }
                if (query.wbw === undefined) {
                    query.wbw = false
                }
                if (query.wbw) {
                    const regex = new RegExp(`\\b${query.findBy}\\b`, 'gi')
                    data = data.replace(regex, query.replaceBy)
                } else {
                    const regex = new RegExp(`${query.findBy}`, 'gi')
                    data = data.replace(regex, query.replaceBy)
                }
            })

            const csvContent = `data:text/csv;charset=utf-8,${data}`

            const link = document.createElement('a')
            link.href = csvContent
            link.download = file.name + '.ozinpic.csv'
            link.click()
            setLoading(false)

            message.success('Complete!')
            setFile(null)
            localStorage.clear()
        } catch (err) {
            message.error(err.message)
        }
    }

    useEffect(() => {
        localStorage.clear()
    }, [])

    useEffect(() => {
        handleFile()
    }, [file, setFile])

    return (
        <div style={{
            padding: 10
        }}>
            <div>
                <Space>
                    <Button size='large' icon={<HomeOutlined />} onClick={() => {
                        navigate('/home')
                    }}>Home</Button>
                    <Upload
                        beforeUpload={(file) => {
                            setFile(file)
                            return false
                        }}
                        showUploadList={false}
                    >
                        <Button type='primary' ghost size='large' icon={<UploadOutlined />}>Upload File</Button>
                    </Upload>
                    <Button type='primary' ghost danger size='large' icon={<SettingOutlined />} onClick={Execute}>Execute</Button>
                    <Upload
                        beforeUpload={(file) => {
                            importQueryList(file)
                            return false
                        }}
                        showUploadList={false}
                    >
                        <Button type='primary' ghost size='large' icon={<UploadOutlined />} >Import Query List</Button>    
                    </Upload>
                    <Button type='primary' ghost size='large' icon={<DownloadOutlined />} onClick={exportQueryList}>Export Query List</Button>
                </Space>
                <div style={{
                    fontSize: 18,
                    marginTop: 10
                }}>
                    {
                        file ? file.name : 'Please upload a File'
                    }
                </div>
            </div>
            <div style={{
                display: 'flex',
                width: '100%',
                marginTop: 15,
                padding: 10,
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '50%',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Form layout='inline' onFinish={(formValue) => {
                        formValue['key'] = Date.now()
                        setQuery([
                            ...queries,
                            formValue
                        ])
                    }}>
                        <Form.Item label='Find By' name='findBy'>
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item label='Replace By' name='replaceBy'>
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item label='Word By Word' name='wbw' valuePropName='checked'>
                            <Checkbox defaultChecked={false}></Checkbox>
                        </Form.Item>
                        <Button htmlType='submit' type="primary" ghost size='large' >Add</Button>
                    </Form>
                </div>
            </div>
            <Divider orientation="center" style={{
                borderColor: 'black'
            }}>
                <h2>Query List</h2>
            </Divider>
            {
                queries && queries.map((query, index) => {

                    return (
                        <div key={query.key} style={{
                            display: 'flex',
                            width: '100%',
                            marginTop: 15,
                            border: '1px solid black',
                            borderRadius: 10,
                            padding: 10
                        }}>
                            <div style={{
                                width: '70%',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{
                                    display: 'flex'
                                }}>
                                    <strong>Find By:</strong>
                                    <div style={{ marginLeft: 10, display: editMode === index ? 'none' : '' }}>{query.findBy}</div>
                                    <Input value={current.findBy} style={{
                                        display: editMode !== index ? 'none' : ''
                                    }} onChange={(event) => {
                                        setCurrent({
                                            ...current,
                                            findBy: event.target.value
                                        })
                                    }} />
                                </div>

                                <div style={{
                                    display: 'flex'
                                }}>
                                    <strong>Replace By:</strong>
                                    <div style={{ marginLeft: 10, display: editMode === index ? 'none' : '' }}>{query.replaceBy}</div>
                                    <Input value={current.replaceBy} style={{
                                        display: editMode !== index ? 'none' : ''
                                    }} onChange={(event) => {
                                        setCurrent({
                                            ...current,
                                            replaceBy: event.target.value
                                        })
                                    }} />
                                </div>

                                <div style={{
                                    display: 'flex'
                                }}>
                                    <strong>Word By Word:</strong>
                                    <Checkbox style={{ marginLeft: 10, display: editMode === index ? 'none' : '' }} checked={query.wbw} disabled={true} />
                                    <Checkbox style={{ marginLeft: 10, display: editMode !== index ? 'none' : '' }} checked={current.wbw} onChange={(event) => {
                                        setCurrent({
                                            ...current,
                                            wbw: event.target.checked === undefined ? false : true
                                        })
                                    }} />
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                width: '30%'
                            }}>
                                <Space>
                                    <Button type="primary" ghost danger={editMode === index ? true : false} size='large' onClick={() => {
                                        if (editMode === -1) {
                                            setCurrent(query)
                                        } else {
                                            queries[index] = current
                                        }
                                        setEditMode(editMode === index ? -1 : index)
                                    }}>
                                        {
                                            editMode === index ? 'Save' : 'Edit'
                                        }
                                    </Button>
                                    <Button onClick={() => {
                                        setQuery(queries.filter(item => item.key !== query.key))
                                    }}
                                        type="primary" ghost danger size='large' disabled={editMode === index ? true : false}>Delete</Button>
                                </Space>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default TextReplacement