import '../css/ProductImage.css'

const ProductImage = ({ source, alternative = "Foto de producto", width = '200px' }) => {
  return (
    <div className='product-aligner m-0 p-0'>
      <section className="product-container" style={{ width: width, height: width }}>
        <img className="product-image" src={source} alt={alternative} />
      </section>
    </div>
  )
}

export default ProductImage