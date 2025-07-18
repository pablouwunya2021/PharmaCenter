import React, { useEffect, useState } from 'react'

const images = [
  {
    src: "https://img.freepik.com/fotos-premium/mujer-feliz-visita-al-medico-ginecologo-hospital-o-clinica-medica-consultor-embarazo-medico-examina-vientre-chequeo-atencion-medica-bebe-madre-concepto-ginecologia_1212-6589.jpg",
    caption: "¡Grandes ofertas en medicamentos!",
  },
  {
    src: "https://media.istockphoto.com/id/1461330630/es/foto/mujer-feliz-revisando-sus-datos-m%C3%A9dicos-con-una-doctora-negra-en-la-cl%C3%ADnica.jpg?s=612x612&w=0&k=20&c=k7kpsvpT9mi1O4IWd_FLL3zAZMAkk2LHLdVOY3i1aYA=",
    caption: "Entrega rápida y segura",
  },
  {
    src: "https://us.123rf.com/450wm/pitinan/pitinan1908/pitinan190801920/128481625-feliz-mujer-embarazada-visita-al-m%C3%A9dico-ginec%C3%B3logo-en-el-hospital-o-cl%C3%ADnica-m%C3%A9dica-para-consultor-de.jpg?ver=6",
    caption: "Atención médica las 24 horas",
  },
]

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const moveCarousel = (direction) => {
    setCurrentIndex((prev) => (prev + direction + images.length) % images.length)
  }

  return (
    <section className="carousel">
      <div className="carousel-inner">
        {images.map((img, idx) => (
          <div key={idx} className={`carousel-item ${idx === currentIndex ? 'active' : ''}`}>
            <img src={img.src} alt={img.caption} />
            <div className="caption">{img.caption}</div>
          </div>
        ))}
      </div>
      <button className="carousel-btn prev" onClick={() => moveCarousel(-1)}>&#10094;</button>
      <button className="carousel-btn next" onClick={() => moveCarousel(1)}>&#10095;</button>
    </section>
  )
}

export default Carousel
