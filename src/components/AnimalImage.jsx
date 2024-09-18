import '../css/AnimalImage.css'

const AnimalImage = ({ source, alternative = "Foto de animal", width = '200px' }) => {
  return (
    <div className='animal-aligner p-0 m-0'>
      <section className="animal-container" style={{ width: width, height: width }}>
        <img className="animal-image" src={source} alt={alternative} />
      </section>
    </div>
  )
}

export default AnimalImage