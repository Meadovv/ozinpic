import CSVUpload from '../Components/CSVUpload/CSVUpload'
import DescriptionUpload from '../Components/DescriptionUpload/DescriptionUpload'
import SaleManager from '../Components/SaleManager/SaleManager'
import SizeManager from '../Components/SizeManager/SizeManager'
import TagManager from '../Components/TagManager/TagManager'

const ProductGenerator = () => {

    return (
        <div className='m-3'>
            <h1>Product Generator</h1>
            <CSVUpload />
            <DescriptionUpload />
            <SizeManager />
            <SaleManager />
            <TagManager />
        </div>
    )
}

export default ProductGenerator;