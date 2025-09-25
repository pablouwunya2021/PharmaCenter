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

  const S = {
    section: { marginTop: 30, fontFamily: '"Montserrat", system-ui, -apple-system, Segoe UI, Roboto, sans-serif', color: '#312e81' },
    title: { textAlign: 'center', fontWeight: 700, fontSize: 'clamp(22px, 3vw, 28px)', margin: '0 0 14px' },
    wrapper: { position: 'relative', display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 10 },
    arrow: {
      border: 0, width: 44, height: 44, borderRadius: 999, background: '#c7b7f3', color: '#4c1d95',
      fontSize: 20, cursor: 'pointer', display: 'grid', placeItems: 'center', transition: 'transform .15s ease, filter .15s ease'
    },
    arrowHover: { transform: 'scale(1.05)', filter: 'brightness(1.05)' },
    carousel: {
      display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(260px, 1fr)',
      gap: 18,
      overflowX: 'hidden',          // <- sin barra visible
      scrollSnapType: 'x mandatory',
      padding: '8px 6px 12px',
      overscrollBehavior: 'contain' // reduce rebotes en móviles
    },
    card: { scrollSnapAlign: 'start' },
    media: {
      position: 'relative', borderRadius: 16, overflow: 'hidden',
      border: '1px solid rgba(76, 29, 149, .08)', background: '#fff',
      boxShadow: '0 8px 24px rgba(76, 29, 149, .10)', transition: 'transform .18s ease, boxShadow .18s ease'
    },
    mediaHover: { transform: 'translateY(-2px)', boxShadow: '0 10px 28px rgba(76, 29, 149, .16)' },
    img: { width: '100%', height: 200, objectFit: 'cover', display: 'block' },
    badge: {
      position: 'absolute', top: 10, left: 10, padding: '6px 10px', borderRadius: 999,
      background: 'rgba(0,0,0,.65)', color: '#fcf4f4ff', fontSize: 12, fontWeight: 600, letterSpacing: .3
    },
    gradient: {
      position: 'absolute', left: 0, right: 0, bottom: 0, height: '58%',
      background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.75) 100%)'
    },
    adTitle: {
      position: 'absolute', left: 14, right: 14, bottom: 12,
      color: '#fff', fontWeight: 800, fontSize: 16, lineHeight: 1.2,
      textShadow: '0 1px 2px rgba(0,0,0,.4)'
    },
    subtle: { textAlign: 'center', color: '#6b7280' },
    error: { textAlign: 'center', color: '#b91c1c' },
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
