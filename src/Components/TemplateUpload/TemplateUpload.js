import { useState } from "react";
import { Button, Checkbox, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import TemplateInformationCard from "./TemplateInformationCard";
import templateJSON from '../../Resources/template.json'

const TemplateUpload = () => {
    const [fileName, setFileName] = useState('Chưa có file')
    const [file, setFile] = useState()

    return (
        <div>
            <hr />
            <h5>File Template hiện tại: {fileName}</h5>
            <div className="mb-2">
                <Checkbox onChange={(value) => {
                    if(value.target.checked) {
                        localStorage.setItem('headerTemplate', JSON.stringify(templateJSON))
                        setFile(null)
                        setFileName('Chưa có file')
                    } else {
                        localStorage.removeItem('headerTemplate')
                    }
                }}>Sử dụng Template của hệ thống</Checkbox>
            </div>
            <Upload
                beforeUpload={(file) => {
                    setFileName(file.name)
                    setFile(file)
                    return false
                }}
                showUploadList={false}
            >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {
                file && <TemplateInformationCard className='mt-2' file={file} />
            }
        </div>
    )
}

export default TemplateUpload