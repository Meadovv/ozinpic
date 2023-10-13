import { useEffect, useState } from "react";

const DescriptionInformationCard = ({ className, file }) => {

    const [loading, setLoading] = useState(true)
    const [numRow, setNumRow] = useState(0)

    const handleFile = (file) => {
        const fileReader = new FileReader();

        fileReader.readAsText(file)

        fileReader.onload = (e) => {
            const fileData = e.target.result
            setNumRow(fileData.split('\n').length - 1)

            localStorage.setItem('description', fileData)
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
                        <h5>Tổng số Description: {numRow}</h5>
                    </>
            }
        </div>
    )
}

export default DescriptionInformationCard