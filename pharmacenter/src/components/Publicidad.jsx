import React from 'react';

function Publicidad() {
  // Array estático de publicidad con imágenes locales y URLs
  const anuncios = [
    {
      id: 1,
      imagen: "https://scontent.fgua1-3.fna.fbcdn.net/v/t39.30808-6/496930304_1026811206213833_5844929764370606322_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=kFJJkuidYqAQ7kNvwEngLnL&_nc_oc=AdlTh0oKnVatEU7J_JOsPuyzsG1VoBDddaCudmi9mzKhGTEZ2JWUCkCXrJukUtQHCQg&_nc_zt=23&_nc_ht=scontent.fgua1-3.fna&_nc_gid=UIz-47C7N2Ol9Pu5J49viA&oh=00_AfJQBRqSicmP1fo2ZjkihNC_hBxSMDJqiN4OnQKDB5PeXg&oe=682ADB48",
      url: "https://www.facebook.com/photo?fbid=1026811202880500&set=a.379335600961400"
    },
    {
      id: 2,
      imagen: "https://scontent.fgua1-2.fna.fbcdn.net/v/t39.30808-6/495905493_1022410209987266_3957474058782481060_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=I9TIdIsLnEMQ7kNvwHfaqcu&_nc_oc=AdkcqEpJ_U8uSUT_w3FmEQP-rLXHkT_UnT_PTyooQzfOaymGLgCs37dJ7Uq-8gMDY1w&_nc_zt=23&_nc_ht=scontent.fgua1-2.fna&_nc_gid=vQSGwYvJSWNSm7BysxQBCQ&oh=00_AfKYtUMCLcde2eDDNT1FEw_UQ8wT6KBGsHBY66beRIOTrQ&oe=682AC0A2",
      url: "https://www.facebook.com/photo?fbid=1023561536538800&set=a.379335600961400"
    },
    {
      id: 3,
      imagen: "https://scontent.fgua1-1.fna.fbcdn.net/v/t39.30808-6/496830082_1022408673320753_198745469175664372_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=QxAyFLxBuxcQ7kNvwE9M30c&_nc_oc=AdmFsLBMK4k50IXb3dcOaqEGmJZEtgHGR_-uJni7GuflrHTXvbTGNo0iBWshLz1BxIA&_nc_zt=23&_nc_ht=scontent.fgua1-1.fna&_nc_gid=nMtwelkKTeOA7j8p3S7dvA&oh=00_AfJlOOYPEmZL3VtmvQh-mERs9POh1yuQvMqPFkbMeMkYyQ&oe=682AE072",
      url: "https://www.facebook.com/photo?fbid=1022859499942337&set=a.379335600961400"
    }
  ];

  const moveCarousel = (direction) => {
    const carousel = document.getElementById('pubCarousel');
    const scrollAmount = carousel.clientWidth;
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="catalog" style={{ marginTop: '30px', fontFamily: 'Montserrat, sans-serif' }}>
      <h2>Ofertas Especiales</h2>
      <div className="catalog-container">
        <button className="catalog-btn prev" onClick={() => moveCarousel(-1)}>&#10094;</button>
        <div className="catalog-carousel" id="pubCarousel">
          {anuncios.map((anuncio) => (
            <div className="card" key={anuncio.id} style={{ position: 'relative' }}>
              <img 
                src={anuncio.imagen} 
                alt="Publicidad"
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  filter: 'brightness(0.95)'
                }}
              />
              <a 
                href={anuncio.url}
                className="btn-comprar"
                style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '8px 25px',
                  backgroundColor: 'rgba(92, 60, 146, 0.85)',
                  color: 'white',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  backdropFilter: 'blur(3px)'
                }}
              >
                Ver más
              </a>
            </div>
          ))}
        </div>
        <button className="catalog-btn next" onClick={() => moveCarousel(1)}>&#10094;</button>
      </div>
    </section>
  );
}

export default Publicidad;