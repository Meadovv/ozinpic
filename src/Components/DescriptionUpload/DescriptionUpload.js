import { useEffect, useState } from "react";
import { Button, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import DescriptionInformationCard from './DescriptionInformationCard'

const DescriptionUpload = () => {
    const [fileName, setFileName] = useState('Chưa có file')
    const [file, setFile] = useState()

    useEffect(() => {
        localStorage.setItem('description', 'auto')
    }, [])

    return (
        <div>
            <hr />
            <h5>File Description hiện tại: {fileName}</h5>
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
                file && <DescriptionInformationCard className='mt-2' file={file} />
            }
        </div>
    )
}

export default DescriptionUpload