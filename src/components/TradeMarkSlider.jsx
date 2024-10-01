import React from "react";
import "../css/TradeMarkSlider.css"; // Asegúrate de crear un archivo CSS separado para los estilos.

const TradeMarkSlider = ({ time, width, height }) => {
  const marcas = [
    "https://res.cloudinary.com/duic1bovf/image/upload/v1727816434/01_-_Pedigree_fq0mhu.png",
    "https://res.cloudinary.com/duic1bovf/image/upload/v1727816435/02_-_Whiskas_tmuvub.png",
    "https://res.cloudinary.com/duic1bovf/image/upload/v1727816435/03_-_RoyalCanin_e8wsfo.png",
    "https://res.cloudinary.com/duic1bovf/image/upload/v1727816434/04_-_Eukanuba_k77xli.webp",
    "https://res.cloudinary.com/duic1bovf/image/upload/v1727816435/05_-_IAMS_x5jxvg.png",
    "https://res.cloudinary.com/duic1bovf/image/upload/v1727816435/06_-_Sheba_pndj0o.png",
    "https://res.cloudinary.com/duic1bovf/image/upload/v1727816435/07_-_Nutro_alilfm.png",
    "https://res.cloudinary.com/duic1bovf/image/upload/v1727816435/08_-_NannyCan_cd9c3r.webp",
    "https://res.cloudinary.com/duic1bovf/image/upload/v1727816435/09_-_NexGard_azrcxj.png",
    "https://res.cloudinary.com/duic1bovf/image/upload/v1727816435/10_-_FerPlast_y5c92h.png",
  ]

  return (
    <>
      <div
        className="slider"
        style={{
          "--time": `${time || "10s"}`,
          "--width": `${width || "100px"}`,
          "--height": `${height || "50px"}`,
          "--quantity": `${marcas.length}`,
        }}
      >
        <div className="list">
          {marcas.map((url, i) => (
            <div className="item" style={{ "--position": i + 1 }} key={i}>
              <img src={url} alt={`Slide ${i + 1}`} />
            </div>
          ))}
        </div>
      </div >
    </>
  );
};

export default TradeMarkSlider;