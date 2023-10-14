import { Button, message, Progress, Space } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CSVUpload from '../Components/CSVUpload/CSVUpload'
import DescriptionUpload from '../Components/DescriptionUpload/DescriptionUpload'
import SaleManager from '../Components/SaleManager/SaleManager'
import TagManager from '../Components/TagManager/TagManager'
import TemplateUpload from '../Components/TemplateUpload/TemplateUpload'
import AttributeManager from '../Components/AttributeManager/AttributeManager'
import VariantManager from '../Components/VariantManager/VariantManager'
import CategoryManager from '../Components/CategoryManager/CategoryManager'
import GtinManager from '../Components/GtinManager/GtinManager'
import BrandManager from '../Components/BrandManager/BrandManager'
import CopyManager from '../Components/CopyManager/CopyManager'

import sizeTable from '../Resources/sizeTable.json'

function getName(name) {
    name = name.replace('T-Shirt', '')
    name = name.replace('T-shirt', '')
    name = name.replace('Hoodie', '')
    name = name.replace('Sweatshirt', '')
    name = name.replace('Unisex', '')
    name = name.replace(/[0-9]+/g, '');

    name = name.replace(/\s{2,}/g, ' ').trim()

    return name
}

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

const SKUGen = (categoryCode, dataIndex) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = today.getFullYear()
    const hour = String(today.getHours()).padStart(2, '0')
    const minute = String(today.getMinutes()).padStart(2, '0')

    const time = hour + minute
    const date = yyyy + mm + dd;

    return categoryCode + '-' + date + '-' + time + '-' + dataIndex
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
                const attributes = JSON.parse(localStorage.getItem('attributes'))
                const gtin = localStorage.getItem('gtin')
                const brand = localStorage.getItem('brand')
                const duplicates = localStorage.getItem('copy').split(',')

                // generate variant

                let skuArray = []
                variants[0].data.value.split(',').forEach((item, dataIndex) => {
                    skuArray.push({
                        key: item,
                        price: variants[0].data.setting[dataIndex]
                    })
                })
                let nextArray = []
                let next = 1
                while (next !== variants.length) {
                    skuArray.forEach(preItem => {
                        variants[next].data.value.split(',').forEach((nextItem, dataIndex) => {
                            nextArray.push({
                                key: preItem.key + '-' + nextItem,
                                price: preItem.price + variants[next].data.setting[dataIndex]
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

                duplicates.forEach((duplicate, duplicateIndex) => {
                    fileData.forEach((data, dataIndex) => {
                        const rowData = data.split(',')
                        csvRow = []
                        if (dataIndex === 0) {  // add header
                            if(duplicateIndex !== 0) return;
                            headerTemplate.forEach((element, index) => {
                                if(element.key === 'Tags') TagColumnIndex = index
                                csvRow.push(element.key)
                                if (element.product.type === 'match') {
                                    mapHeader.set(element.key, headers.indexOf(element.product.value))
                                }
                            })

                            attributes.forEach((attribute, dataIndex) => {
                                csvRow.push(`Attribute ${dataIndex + 1} name`)
                                csvRow.push(`Attribute ${dataIndex + 1} value(s)`)
                                csvRow.push(`Attribute ${dataIndex + 1} visible`)
                                csvRow.push(`Attribute ${dataIndex + 1} global`)
                            })

                            variants.forEach((variant, dataIndex) => {
                                csvRow.push(`Attribute ${attributes.length + dataIndex + 1} name`)
                                csvRow.push(`Attribute ${attributes.length + dataIndex + 1} value(s)`)
                                csvRow.push(`Attribute ${attributes.length + dataIndex + 1} visible`)
                                csvRow.push(`Attribute ${attributes.length + dataIndex + 1} global`)
                            })

                            csvHeader.push(csvRow)

                        } else {// add product
                            let productName = getName(rowData[mapHeader.get('Name')])
                            rowData[mapHeader.get('Name')] = "Unisex " + productName + " " + duplicate

                            headerTemplate.forEach(element => {
                                if (element.product.type === 'default') {
                                    if (element.product.value === 'null') {
                                        csvRow.push('')
                                    } else {
                                        if (element.key === 'SKU') {
                                            SKUCode = duplicate + "-" + SKUGen(categoryCode, dataIndex)
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
                                        if (element.key === 'Short description') {
                                            csvRow.push("Unisex " + productName + " " + duplicate + " best Gift for Fan!")
                                            return
                                        }
                                        if (element.key === 'Description') {
                                            csvRow.push(descriptionData[(dataIndex - 1 + duplicateIndex) % descriptionData.length])
                                            return
                                        }
                                        if (element.key === 'Categories') {
                                            csvRow.push(category)
                                            return
                                        }
                                        if (element.key === 'Meta: _rank_math_gtin_code') {
                                            csvRow.push(gtin)
                                            return
                                        }
                                        if (element.key === 'Meta: _wc_gla_gtin') {
                                            csvRow.push(gtin)
                                            return
                                        }
                                        if (element.key === 'Meta: rank_math_focus_keyword') {
                                            csvRow.push(productName);
                                            return
                                        }
                                        if (element.key === 'Meta: _wc_gla_brand') {
                                            csvRow.push(brand)
                                            return
                                        }
                                        csvRow.push(element.product.value)
                                    }
                                } else {
                                    if (element.key === 'Images') {
                                        csvRow.push(rowData[mapHeader.get(element.key)] + "," + sizeTable.link)
                                    } else csvRow.push(rowData[mapHeader.get(element.key)])
                                }
                            })

                            attributes.forEach(attribute => {
                                csvRow.push(attribute.data.name)
                                if(attribute.data.value === 'Render') {
                                    csvRow.push(duplicate)
                                } else {
                                    csvRow.push(attribute.data.value)
                                }
                                csvRow.push('1')
                                csvRow.push('1')
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
                        if (dataIndex !== 0) {
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
                                                    return
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

                                attributes.forEach((attribute, dataIndex) => {
                                    csvRow.push('')
                                    csvRow.push('')
                                    csvRow.push('')
                                    csvRow.push('')
                                })

                                // add variant attribute
                                sku.key.split('-').forEach((key, dataIndex) => {
                                    csvRow.push(variants[dataIndex].data.name)
                                    csvRow.push(key)
                                    csvRow.push('')
                                    csvRow.push(1)
                                })


                                csvVariant.push(csvRow)
                            })
                        }
                        setPercent((dataIndex / fileData.length) * 100)
                    })
                })


                // generate custom tags

                tags.forEach(tag => {
                    if (Number(tag.percent) !== 100) {
                        csvProduct = shuffle(csvProduct)
                        for (let i = 0; i < Math.round(Number(tag.percent) / 100 * Number(csvProduct.length)); ++i) {
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
                link.download = 'ozinpic-' + localStorage.getItem('fileName')
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
                            <Button onClick={() => {
                                navigate('/')
                            }}>Home</Button>
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
                        <GtinManager />
                        <BrandManager />
                        <AttributeManager />
                        <VariantManager />
                        <TagManager />
                        <CopyManager />
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