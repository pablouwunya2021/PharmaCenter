import React, { useEffect, useState, useRef } from 'react';

function normalizarUrl(url) {
  if (!url) return '#';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function Publicidad() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const carruselRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await fetch('http://localhost:3000/api/publicidad');
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        if (!j.success) throw new Error(j.error || 'Respuesta inválida');
        setAnuncios(Array.isArray(j.data) ? j.data : []);
      } catch (e) {
        console.error(e);
        setErr('No se pudo cargar la publicidad');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const move = (dir) => {
    const el = carruselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  const bloquearScroll = (e) => {
    // Bloquea el scroll con rueda/gesto para que solo se use con flechas
    e.preventDefault();
  };



  const Arrow = ({ children, onClick }) => {
    const [hover, setHover] = useState(false);
    return (
      <button
        style={{ ...S.arrow, ...(hover ? S.arrowHover : null) }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
        aria-label={children === '❮' ? 'Anterior' : 'Siguiente'}
      >
        {children}
      </button>
    );
  };

  const AdCard = ({ a }) => {
    const [hover, setHover] = useState(false);
    const id = a.id ?? a.idpublicidad;
    const titulo = a.titulo ?? 'Publicidad';
    const tipo = a.tipo ?? a.tipo_publicidad;
    const descuento = a.descuento_porcentaje ? `${Number(a.descuento_porcentaje)}%` : null;
    const img = a.imagen_url || 'https://placehold.co/800x400?text=Publicidad';
    const href = normalizarUrl(a.url_enlace);

    return (
      <article style={S.card} key={id}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={titulo}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          <div
            style={{ ...S.media, ...(hover ? S.mediaHover : null) }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <img style={S.img} src={img} alt={titulo} loading="lazy" />
            <span style={S.badge}>{tipo}{descuento ? ` • ${descuento}` : ''}</span>
            <div style={S.gradient} />
            <div style={S.adTitle}>{titulo}</div>
          </div>
        </a>
      </article>
    );
  };

  if (loading) {
    return (
      <section style={S.section}>
        <h2 style={S.title}>Ofertas Especiales</h2>
        <p style={S.subtle}>Cargando…</p>
      </section>
    );
  }
  if (err) {
    return (
      <section style={S.section}>
        <h2 style={S.title}>Ofertas Especiales</h2>
        <p style={S.error}>{err}</p>
      </section>
    );
  }
  if (!anuncios.length) {
    return (
      <section style={S.section}>
        <h2 style={S.title}>Ofertas Especiales</h2>
        <p style={S.subtle}>No hay publicidad vigente por el momento.</p>
      </section>
    );
  }

  return (
    <section style={S.section}>
      <h2 style={S.title}>Ofertas Especiales</h2>

      <div style={S.wrapper}>
        <Arrow onClick={() => move(-1)}>❮</Arrow>

        <div
          style={S.carousel}
          ref={carruselRef}
          onWheel={bloquearScroll}
          onTouchMove={bloquearScroll}   // bloquea swipe en móviles
        >
          {anuncios.map(a => <AdCard key={a.id ?? a.idpublicidad} a={a} />)}
        </div>

        <Arrow onClick={() => move(1)}>❯</Arrow>
      </div>
    </section>
  );
}
