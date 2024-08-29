import '../css/Loading.css';

const Loading = () => {
  return (
    <>
      <section className="loading">
        <div className="loader">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} style={{ '--i': i + 1 }}></span>
          ))}
        </div>
      </section>
    </>
  );
}

export default Loading;