import '../css/ProfileImage.css'

const ProfileImage = ({ source, alternative = "Foto de perfil", width = '200px' }) => {
  return (
    <div className='profile-aligner p-0 m-0'>
      <section className="profile-container" style={{ width: width, height: width }}>
        <img className="profile-image" src={source} alt={alternative} />
      </section>
    </div>
  )
}

export default ProfileImage