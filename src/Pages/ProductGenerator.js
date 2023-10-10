import { Button, message, Progress, Space } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CSVUpload from '../Components/CSVUpload/CSVUpload'
import DescriptionUpload from '../Components/DescriptionUpload/DescriptionUpload'
import SaleManager from '../Components/SaleManager/SaleManager'
import TagManager from '../Components/TagManager/TagManager'
import TemplateUpload from '../Components/TemplateUpload/TemplateUpload'
import VariantManager from '../Components/VariantManager/VariantManager'
import CategoryManager from '../Components/CategoryManager/CategoryManager'

const SKUGen = (categoryCode, index) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = today.getFullYear()
    const hour = String(today.getHours()).padStart(2, '0')
    const minute = String(today.getMinutes()).padStart(2, '0')
    const sec = String(today.getSeconds()).padStart(2, '0')

    const time = hour + "." + minute + "." + sec
    const date = yyyy + mm + dd;

    return categoryCode + '-' + date + '-' +time + '-' + index
}
const ProductGenerator = () => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [percent, setPercent] = useState(0)

    let csvArray = [];

    const generate = () => {
        if (localStorage.getItem('rowNumber') < 2) {
            message.error('File CSV không hợp lệ')
        } else {
            if (!localStorage.getItem('headerTemplate')) {
                message.error('Cài đặt Field Template trước')
            } else {
                setLoading(true)

                // lấy template

                const map = new Map()

                const headers = localStorage.getItem('headers').split(',')
                const fileData = localStorage.getItem('rows').split('\n')
                const headerTemplate = JSON.parse(localStorage.getItem('headerTemplate'))
                const variants = JSON.parse(localStorage.getItem('variants'))
                const tags = JSON.parse(localStorage.getItem('tags'))
                const category = localStorage.getItem('category')
                const categoryCode = localStorage.getItem('categoryCode')
                const descriptionData = localStorage.getItem('description').split('\n')

                let csvRow = []

                fileData.forEach((data, index) => {
                    const rowData = data.split(',')
                    csvRow = []
                    if (index === 0) {  // add header
                        headerTemplate.forEach(element => {
                            csvRow.push(element.key)
                            if (element.product.type === 'match') {
                                map.set(element.key, headers.indexOf(element.product.value))
                            }
                        })
                        variants.forEach((variant, index) => {
                            csvRow.push(`Attribute ${index + 1} name`)
                            csvRow.push(`Attribute ${index + 1} value(s)`)
                            csvRow.push(`Attribute ${index + 1} visible`)
                            csvRow.push(`Attribute ${index + 1} global`)
                        })
                    } else {// add product
                        headerTemplate.forEach(element => {
                            if (element.product.type === 'default') {
                                if (element.product.value === 'null') {
                                    csvRow.push('')
                                } else {
                                    if (element.key === 'SKU') {
                                        csvRow.push(SKUGen(categoryCode, index))
                                        return
                                    }
                                    if(element.key === 'Tags') {
                                        let tagString = ''
                                        tags.forEach(tag => {
                                            if(tag.percent === 100) {
                                                tagString = tagString + tag.data + ','
                                            }
                                        })
                                        csvRow.push(tagString)
                                        return
                                    }
                                    if(element.key === 'Description') {
                                        csvRow.push(descriptionData[index % descriptionData.length])
                                        return
                                    }
                                    if(element.key === 'Categories') {
                                        csvRow.push(category)
                                        return
                                    }
                                    csvRow.push(element.product.value)
                                }
                            } else {
                                csvRow.push(rowData[map.get(element.key)])
                            }
                        })

                        variants.forEach(variant => {
                            csvRow.push(variant.data.name)
                            csvRow.push(variant.data.value)
                            csvRow.push('1') // visible
                            csvRow.push('1') // global
                        })
                    }
                    csvArray.push(csvRow)
                    setPercent((index / fileData.length) * 100)
                })

                console.log(csvArray)

                setLoading(false)
            }
        }
    }

    return (
        <>
            {
                loading ? <Progress percent={percent} /> :
                    <div className='m-3'>
                        <h1>Product Generator</h1>
                        <Space>
                            <Button
                                onClick={() => {
                                    localStorage.clear()
                                    window.location.reload()
                                }}
                            >Clear Cache</Button>
                            <Button
                                onClick={() => {
                                    navigate('/product-generator/field-setting')
                                }}
                            >Field Setting</Button>
                        </Space>
                        <TemplateUpload />
                        <CSVUpload />
                        <DescriptionUpload />
                        <CategoryManager />
                        <SaleManager />
                        <VariantManager />
                        <TagManager />
                        <Button
                            type='primary'
                            style={{
                                marginTop: 10
                            }}
                            onClick={generate}
                        >Next Step</Button>
                    </div>
            }
        </>
    )
}

export default ProductGenerator;