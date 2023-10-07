import { useEffect, useState } from "react";

const CSVInformationCard = ({ className, file }) => {

    const [loading, setLoading] = useState(true)
    const [numRow, setNumRow] = useState(0)
    const [numCol, setNumCol] = useState(0)

    const handleFile = (file) => {
        const fileReader = new FileReader();

        fileReader.readAsText(file)

        fileReader.onload = (e) => {
            const fileData = e.target.result
            const rowData = fileData.split('\n')
            const headerData = rowData[0].split(',')

            setNumCol(headerData.length)
            setNumRow(rowData.length - 1)

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
                        <h5>Tổng số Sản phẩm: {numRow}</h5>
                    </>
            }
        </div>
    )
}

export default CSVInformationCard