import { useState } from "react";
import { Button, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import CSVInformationCard from "./CSVInformationCard";

const CSVUpload = () => {
    const [fileName, setFileName] = useState('Chưa có file')
    const [file, setFile] = useState()

    return (
        <div>
            <hr />
            <h5>File CSV hiện tại: {fileName}</h5>
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
                file && <CSVInformationCard className='mt-2' file={file} />
            }
        </div>
    )
}

export default CSVUpload