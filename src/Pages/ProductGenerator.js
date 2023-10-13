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

function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const SKUGen = (categoryCode, index) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = today.getFullYear()
    const hour = String(today.getHours()).padStart(2, '0')
    const minute = String(today.getMinutes()).padStart(2, '0')
    const sec = String(today.getSeconds()).padStart(2, '0')

    const time = hour + minute + sec
    const date = yyyy + mm + dd;

    return categoryCode + '-' + date + '-' + time + '-' + index
}
const ProductGenerator = () => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [percent, setPercent] = useState(0)

    const generate = () => {

        let csvHeader = []
        let csvProduct = []
        let csvVariant = []

        if (localStorage.getItem('rowNumber') < 2) {
            message.error('File CSV không hợp lệ')
        } else {
            if (!localStorage.getItem('headerTemplate')) {
                message.error('Cài đặt Field Template trước')
            } else {
                setLoading(true)

                const mapHeader = new Map()
                let TagColumnIndex = 14

                const headers = localStorage.getItem('headers').split(',')
                const fileData = localStorage.getItem('rows').split('\n')
                const headerTemplate = JSON.parse(localStorage.getItem('headerTemplate'))
                const variants = JSON.parse(localStorage.getItem('variants'))
                const tags = JSON.parse(localStorage.getItem('tags'))
                const category = localStorage.getItem('category')
                const categoryCode = localStorage.getItem('categoryCode')
                const descriptionData = localStorage.getItem('description').split('\n')
                const price = Number(localStorage.getItem('sameCost'))
                const sale = Number(localStorage.getItem('sale'))

                // generate variant

                let skuArray = []
                variants[0].data.value.split(',').forEach((item, index) => {
                    skuArray.push({
                        key: item,
                        price: variants[0].data.setting[index]
                    })
                })
                let nextArray = []
                let next = 1
                while (next !== variants.length) {
                    skuArray.forEach(preItem => {
                        variants[next].data.value.split(',').forEach((nextItem, index) => {
                            nextArray.push({
                                key: preItem.key + '-' + nextItem,
                                price: preItem.price + variants[next].data.setting[index]
                            })
                        })
                    })
                    skuArray = nextArray
                    nextArray = []
                    next = next + 1
                }

                // add product and variant

                let csvRow = []
                let SKUCode = null

                fileData.forEach((data, index) => {
                    const rowData = data.split(',')
                    csvRow = []
                    if (index === 0) {  // add header
                        headerTemplate.forEach(element => {
                            csvRow.push(element.key)
                            if (element.product.type === 'match') {
                                mapHeader.set(element.key, headers.indexOf(element.product.value))
                            }
                        })
                        variants.forEach((variant, index) => {
                            csvRow.push(`Attribute ${index + 1} name`)
                            csvRow.push(`Attribute ${index + 1} value(s)`)
                            csvRow.push(`Attribute ${index + 1} visible`)
                            csvRow.push(`Attribute ${index + 1} global`)
                        })
                        csvHeader.push(csvRow)

                    } else {// add product
                        headerTemplate.forEach(element => {
                            if (element.product.type === 'default') {
                                if (element.product.value === 'null') {
                                    csvRow.push('')
                                } else {
                                    if (element.key === 'SKU') {
                                        SKUCode = SKUGen(categoryCode, index)
                                        csvRow.push(SKUCode)
                                        return
                                    }
                                    if (element.key === 'Tags') {
                                        let tagString = ''
                                        tags.forEach(tag => {
                                            if (tag.percent === 100) {
                                                tagString = tagString + tag.data + ','
                                            }
                                        })
                                        csvRow.push(tagString)
                                        return
                                    }
                                    if (element.key === 'Description') {
                                        csvRow.push(descriptionData[(index - 1) % descriptionData.length])
                                        return
                                    }
                                    if (element.key === 'Categories') {
                                        csvRow.push(category)
                                        return
                                    }
                                    csvRow.push(element.product.value)
                                }
                            } else {
                                csvRow.push(rowData[mapHeader.get(element.key)])
                            }
                        })

                        variants.forEach(variant => {
                            csvRow.push(variant.data.name)
                            csvRow.push(variant.data.value)
                            csvRow.push('1') // visible
                            csvRow.push('1') // global
                        })

                        csvProduct.push(csvRow)
                    }

                    // add variant
                    if (index !== 0) {
                        skuArray.forEach((sku, skuIndex) => {
                            csvRow = []
                            headerTemplate.forEach((item) => {
                                if (item.variant.type === 'default') {
                                    if (item.variant.value === 'null') {
                                        csvRow.push('')
                                    } else {
                                        if (item.variant.value === 'render') {
                                            if (item.key === 'Name') {
                                                csvRow.push(SKUCode + '-' + sku.key)
                                            }
                                            if (item.key === 'Position') {
                                                csvRow.push(skuIndex + 1)
                                                return
                                            }
                                            if (item.key === 'Parent') {
                                                csvRow.push(SKUCode)
                                                return
                                            }
                                            if (item.key === 'Regular price') {
                                                csvRow.push(toFixed(price + sku.price, 2))
                                                return
                                            }
                                            if (item.key === 'Sale price') {
                                                const regularPrice = price + sku.price
                                                const salePrice = regularPrice - regularPrice * (sale / 100)
                                                csvRow.push(toFixed(salePrice, 2))
                                                return
                                            }
                                        } else {
                                            csvRow.push(item.variant.value)
                                        }
                                    }
                                }
                            })

                            // add variant attribute
                            sku.key.split('-').forEach((key, index) => {
                                csvRow.push(variants[index].data.name)
                                csvRow.push(key)
                                csvRow.push('')
                                csvRow.push(1)
                            })


                            csvVariant.push(csvRow)
                        })
                    }
                    setPercent((index / fileData.length) * 100)
                })

                // generate custom tags

                console.log(csvProduct)

                tags.forEach(tag => {
                    if(Number(tag.percent) !== 100) {
                        csvProduct = shuffle(csvProduct)
                        for(let i = 0; i < Math.round(Number(tag.percent) / 100 * Number(csvProduct.length)); ++i) {
                            csvProduct[i][TagColumnIndex] = csvProduct[i][TagColumnIndex] + tag.data + ","
                        }
                    }
                })



                // create and download csv

                let csvContent = "data:text/csv;charset=utf-8,"

                csvHeader.forEach(row => {
                    let rowContent = ""
                    row.forEach(element => {
                        rowContent = rowContent + "\"" + element + "\"" + ","
                    })
                    csvContent = csvContent + rowContent + "\n"
                })

                csvProduct.forEach(row => {
                    let rowContent = ""
                    row.forEach(element => {
                        rowContent = rowContent + "\"" + element + "\"" + ","
                    })
                    csvContent = csvContent + rowContent + "\n"
                })

                csvVariant.forEach(row => {
                    let rowContent = ""
                    row.forEach(element => {
                        rowContent = rowContent + "\"" + element + "\"" + ","
                    })
                    csvContent = csvContent + rowContent + "\n"
                })



                const link = document.createElement('a')
                link.href = csvContent
                link.download = 'export.csv'
                link.click()
                setLoading(false)

                // reset
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