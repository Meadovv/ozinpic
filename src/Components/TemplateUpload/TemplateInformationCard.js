import { useEffect, useState } from "react";
import { message } from "antd";

const TemplateInformationCard = ({ className, file }) => {

    const [loading, setLoading] = useState(true)
    const [numCol, setNumCol] = useState(0)

    const handleFile = (file) => {
        const fileReader = new FileReader();

        fileReader.readAsText(file)

        fileReader.onload = (e) => {
            const fileData = e.target.result
            try {
                const json = JSON.parse(fileData)
                const jsonString = JSON.stringify(json)
                localStorage.setItem('headerTemplate', jsonString)
            } catch (e) {
                message.error('Template File is error')
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        handleFile(file)
    }, [file])

    return (
        <div className={className}>
            {
                loading ? <h5>Đang xử lý...</h5> :
                    <>
                        <h5>Tổng số trường: {numCol}</h5>
                    </>
            }
        </div>
    )
}

export default TemplateInformationCard