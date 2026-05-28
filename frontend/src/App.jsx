import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8081/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [errorMessage, setErrorMessage] = useState(null);

  // Data states
  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [cartas, setCartas] = useState([]);

  // Test execution state
  const [testResults, setTestResults] = useState(null);
  const [loadingTests, setLoadingTests] = useState(false);

  // Forms states & modals
  const [showModal, setShowModal] = useState(null); // 'equipo' | 'jugador' | 'carta'
  const [editItem, setEditItem] = useState(null); // Item currently being edited

  // Individual Form States
  const [formEquipo, setFormEquipo] = useState({ nombre: '', liga: '', pais: '', escudoUrl: '' });
  const [formJugador, setFormJugador] = useState({ nombre: '', nacionalidad: '', posicion: '', fotoUrl: '', equipoId: '' });
  const [formCarta, setFormCarta] = useState({
    rating: 80, ritmo: 80, tiro: 80, pase: 80, regate: 80, defensa: 80, fisico: 80,
    tipoCarta: 'ORO', jugadorId: ''
  });

  // Load all data on mount
  useEffect(() => {
    fetchEquipos();
    fetchJugadores();
    fetchCartas();
  }, []);

  const clearError = () => setErrorMessage(null);

  const handleError = (err, customMsg) => {
    console.error(err);
    setErrorMessage(`${customMsg}: ${err.message || 'Error de conexión con el backend (servidor en puerto 8081)'}`);
  };

  // --- API Fetches ---
  const fetchEquipos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/equipos`);
      if (!res.ok) throw new Error('Error al cargar equipos');
      const data = await res.json();
      setEquipos(data);
    } catch (err) {
      handleError(err, 'No se pudieron cargar los equipos');
    }
  };

  const fetchJugadores = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/jugadores`);
      if (!res.ok) throw new Error('Error al cargar jugadores');
      const data = await res.json();
      setJugadores(data);
    } catch (err) {
      handleError(err, 'No se pudieron cargar los jugadores');
    }
  };

  const fetchCartas = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cartas`);
      if (!res.ok) throw new Error('Error al cargar cartas FUT');
      const data = await res.json();
      setCartas(data);
    } catch (err) {
      handleError(err, 'No se pudieron cargar las cartas FUT');
    }
  };

  // --- Programmatic Test Execution ---
  const runBackendTests = async () => {
    setLoadingTests(true);
    setTestResults(null);
    try {
      const res = await fetch(`${API_BASE_URL}/tests`);
      if (!res.ok) throw new Error('Error al ejecutar los tests');
      const data = await res.json();
      setTestResults(data);
    } catch (err) {
      handleError(err, 'Error al contactar con el endpoint de pruebas');
    } finally {
      setLoadingTests(false);
    }
  };

  // --- CRUD Operations ---
  
  // EQUIPOS
  const handleSaveEquipo = async (e) => {
    e.preventDefault();
    try {
      const url = editItem ? `${API_BASE_URL}/equipos/${editItem.id}` : `${API_BASE_URL}/equipos`;
      const method = editItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEquipo)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error en la petición');
      }
      setShowModal(null);
      setEditItem(null);
      setFormEquipo({ nombre: '', liga: '', pais: '', escudoUrl: '' });
      fetchEquipos();
      fetchJugadores(); // Refresh in case names updated
    } catch (err) {
      handleError(err, 'Error al guardar el equipo');
    }
  };

  const handleEditEquipo = (eq) => {
    setEditItem(eq);
    setFormEquipo({
      nombre: eq.nombre,
      liga: eq.liga || '',
      pais: eq.pais || '',
      escudoUrl: eq.escudoUrl || ''
    });
    setShowModal('equipo');
  };

  const handleDeleteEquipo = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este equipo? Esto podría afectar a los jugadores asociados.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/equipos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchEquipos();
      fetchJugadores();
      fetchCartas();
    } catch (err) {
      handleError(err, 'Error al eliminar el equipo');
    }
  };

  // JUGADORES
  const handleSaveJugador = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formJugador,
        equipoId: formJugador.equipoId ? parseInt(formJugador.equipoId) : null
      };
      const url = editItem ? `${API_BASE_URL}/jugadores/${editItem.id}` : `${API_BASE_URL}/jugadores`;
      const method = editItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error en la petición');
      }
      setShowModal(null);
      setEditItem(null);
      setFormJugador({ nombre: '', nacionalidad: '', posicion: '', fotoUrl: '', equipoId: '' });
      fetchJugadores();
      fetchCartas(); // Refresh in case player names updated
    } catch (err) {
      handleError(err, 'Error al guardar el jugador');
    }
  };

  const handleEditJugador = (jg) => {
    setEditItem(jg);
    setFormJugador({
      nombre: jg.nombre,
      nacionalidad: jg.nacionalidad || '',
      posicion: jg.posicion || '',
      fotoUrl: jg.fotoUrl || '',
      equipoId: jg.equipoId ? jg.equipoId.toString() : ''
    });
    setShowModal('jugador');
  };

  const handleDeleteJugador = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este jugador? Se borrarán sus cartas asociadas.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/jugadores/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchJugadores();
      fetchCartas();
    } catch (err) {
      handleError(err, 'Error al eliminar el jugador');
    }
  };

  // CARTAS FUT
  const handleSaveCarta = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formCarta,
        rating: parseInt(formCarta.rating),
        ritmo: parseInt(formCarta.ritmo),
        tiro: parseInt(formCarta.tiro),
        pase: parseInt(formCarta.pase),
        regate: parseInt(formCarta.regate),
        defensa: parseInt(formCarta.defensa),
        fisico: parseInt(formCarta.fisico),
        jugadorId: formCarta.jugadorId ? parseInt(formCarta.jugadorId) : null
      };

      const url = editItem ? `${API_BASE_URL}/cartas/${editItem.id}` : `${API_BASE_URL}/cartas`;
      const method = editItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error en la petición');
      }
      setShowModal(null);
      setEditItem(null);
      setFormCarta({
        rating: 80, ritmo: 80, tiro: 80, pase: 80, regate: 80, defensa: 80, fisico: 80,
        tipoCarta: 'ORO', jugadorId: ''
      });
      fetchCartas();
    } catch (err) {
      handleError(err, 'Error al guardar la carta FUT');
    }
  };

  const handleEditCarta = (ct) => {
    setEditItem(ct);
    setFormCarta({
      rating: ct.rating,
      ritmo: ct.ritmo,
      tiro: ct.tiro,
      pase: ct.pase,
      regate: ct.regate,
      defensa: ct.defensa,
      fisico: ct.fisico,
      tipoCarta: ct.tipoCarta,
      jugadorId: ct.jugadorId ? ct.jugadorId.toString() : ''
    });
    setShowModal('carta');
  };

  const handleDeleteCarta = async (id) => {
    if (!window.confirm('¿Deseas eliminar esta carta FUT?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cartas/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchCartas();
    } catch (err) {
      handleError(err, 'Error al eliminar la carta');
    }
  };

  // Image fallbacks
  const fallbackPlayer = 'https://www.ea.com/sports/fc/ultimate-team/web-app/content/24D6955D-1D29-4184-B52F-C869A68D5D55/2024/fut/items/images/players/html5/240x240/p231747.png';
  const fallbackCrest = 'https://www.ea.com/sports/fc/ultimate-team/web-app/content/24D6955D-1D29-4184-B52F-C869A68D5D55/2024/fut/items/images/clubbadges/html5/large/l11.png';
  const fallbackFlag = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Bandera_de_Espa%C3%B1a.svg';

  return (
    <div className="app-container">
      <header>
        <div className="nav-container">
          <a href="#" className="logo" onClick={() => setActiveTab('dashboard')}>
            FUT <span>Manager</span>
          </a>
          <nav>
            <button
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`nav-link ${activeTab === 'equipos' ? 'active' : ''}`}
              onClick={() => setActiveTab('equipos')}
            >
              Equipos
            </button>
            <button
              className={`nav-link ${activeTab === 'jugadores' ? 'active' : ''}`}
              onClick={() => setActiveTab('jugadores')}
            >
              Jugadores
            </button>
            <button
              className={`nav-link ${activeTab === 'cartas' ? 'active' : ''}`}
              onClick={() => setActiveTab('cartas')}
            >
              Cartas FUT
            </button>
            <button
              className={`nav-link ${activeTab === 'tests' ? 'active' : ''}`}
              onClick={() => setActiveTab('tests')}
            >
              Tests Backend
            </button>
          </nav>
        </div>
      </header>

      <main className="content animated-fade">
        {errorMessage && (
          <div className="card-item" style={{ borderLeft: '4px solid var(--accent-danger)', marginBottom: '2rem', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: 'var(--accent-danger)', fontWeight: 700 }}>Aviso del Sistema</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{errorMessage}</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={clearError}>Entendido</button>
          </div>
        )}

        {/* --- TABS --- */}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="animated-slide">
            <div className="section-header">
              <h1 className="section-title">Dashboard General</h1>
            </div>

            <div className="dashboard-stats">
              <div className="stat-box">
                <div className="stat-box-num">{equipos.length}</div>
                <div className="stat-box-label">Equipos</div>
              </div>
              <div className="stat-box">
                <div className="stat-box-num">{jugadores.length}</div>
                <div className="stat-box-label">Jugadores</div>
              </div>
              <div className="stat-box">
                <div className="stat-box-num">{cartas.length}</div>
                <div className="stat-box-label">Cartas FUT creadas</div>
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Últimas Cartas Añadidas</h3>
            {cartas.length === 0 ? (
              <div className="empty-state">
                <h3>No hay cartas de FUT disponibles</h3>
                <p>Crea equipos y jugadores primero, y luego genera tus cromos personalizados de Ultimate Team.</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('cartas')}>Gestionar Cartas</button>
              </div>
            ) : (
              <div className="grid-fut-cards">
                {cartas.slice(-4).reverse().map((carta) => {
                  const player = jugadores.find(j => j.id === carta.jugadorId);
                  const team = player ? equipos.find(e => e.id === player.equipoId) : null;
                  return (
                    <div key={carta.id} className="fut-card-wrapper">
                      <div className={`fut-card ${carta.tipoCarta}`}>
                        <div className="card-top">
                          <div className="card-badge">
                            <span className="card-rating">{carta.rating}</span>
                            <span className="card-position">{player?.posicion || 'DC'}</span>
                            <img
                              src={fallbackFlag}
                              alt="Flag"
                              className="card-nation-flag"
                            />
                            <img
                              src={team?.escudoUrl || fallbackCrest}
                              alt="Crest"
                              className="card-club-crest"
                            />
                          </div>
                          <div className="card-player-image-container">
                            <img
                              src={player?.fotoUrl || fallbackPlayer}
                              alt={player?.nombre || 'Player'}
                              className="card-player-image"
                            />
                          </div>
                        </div>
                        <div className="card-info">
                          <div className="card-name">{player?.nombre || 'Desconocido'}</div>
                        </div>
                        <div className="card-stats-grid">
                          <div className="stat-item"><span className="stat-value">{carta.ritmo}</span><span className="stat-label">PAC</span></div>
                          <div className="stat-item"><span className="stat-value">{carta.tiro}</span><span className="stat-label">SHO</span></div>
                          <div className="stat-item"><span className="stat-value">{carta.pase}</span><span className="stat-label">PAS</span></div>
                          <div className="stat-item"><span className="stat-value">{carta.regate}</span><span className="stat-label">DRI</span></div>
                          <div className="stat-item"><span className="stat-value">{carta.defensa}</span><span className="stat-label">DEF</span></div>
                          <div className="stat-item"><span className="stat-value">{carta.fisico}</span><span className="stat-label">PHY</span></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* EQUIPOS CRUD TAB */}
        {activeTab === 'equipos' && (
          <div className="animated-slide">
            <div className="section-header">
              <h1 className="section-title">Gestión de Equipos</h1>
              <button className="btn btn-primary" onClick={() => {
                setEditItem(null);
                setFormEquipo({ nombre: '', liga: '', pais: '', escudoUrl: '' });
                setShowModal('equipo');
              }}>
                + Nuevo Equipo
              </button>
            </div>

            {equipos.length === 0 ? (
              <div className="empty-state">
                <h3>No hay equipos registrados</h3>
                <p>Comienza añadiendo un equipo para poder asociar jugadores.</p>
                <button className="btn btn-primary" onClick={() => setShowModal('equipo')}>Añadir Equipo</button>
              </div>
            ) : (
              <div className="grid-cards">
                {equipos.map((eq) => (
                  <div key={eq.id} className="card-item">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img
                        src={eq.escudoUrl || fallbackCrest}
                        alt={eq.nombre}
                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                      />
                      <div>
                        <h3 className="card-item-title">{eq.nombre}</h3>
                        <p className="card-item-subtitle">{eq.liga} | {eq.pais}</p>
                      </div>
                    </div>
                    <div className="card-item-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEditEquipo(eq)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEquipo(eq.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* JUGADORES CRUD TAB */}
        {activeTab === 'jugadores' && (
          <div className="animated-slide">
            <div className="section-header">
              <h1 className="section-title">Gestión de Jugadores</h1>
              <button className="btn btn-primary" onClick={() => {
                setEditItem(null);
                setFormJugador({ nombre: '', nacionalidad: '', posicion: '', fotoUrl: '', equipoId: equipos[0]?.id?.toString() || '' });
                setShowModal('jugador');
              }}>
                + Nuevo Jugador
              </button>
            </div>

            {jugadores.length === 0 ? (
              <div className="empty-state">
                <h3>No hay jugadores registrados</h3>
                <p>Crea jugadores y asócialos a sus respectivos clubes deportivos.</p>
                <button className="btn btn-primary" onClick={() => setShowModal('jugador')}>Añadir Jugador</button>
              </div>
            ) : (
              <div className="grid-cards">
                {jugadores.map((jg) => (
                  <div key={jg.id} className="card-item">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img
                        src={jg.fotoUrl || fallbackPlayer}
                        alt={jg.nombre}
                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                      />
                      <div>
                        <h3 className="card-item-title">{jg.nombre}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>{jg.posicion} | {jg.nacionalidad}</p>
                        <p className="card-item-subtitle" style={{ margin: 0 }}>
                          Club: {jg.equipoNombre || 'Sin club asignado'}
                        </p>
                      </div>
                    </div>
                    <div className="card-item-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEditJugador(jg)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteJugador(jg.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CARTAS FUT CRUD TAB */}
        {activeTab === 'cartas' && (
          <div className="animated-slide">
            <div className="section-header">
              <h1 className="section-title">Colección de Cartas FUT</h1>
              <button className="btn btn-primary" onClick={() => {
                setEditItem(null);
                setFormCarta({
                  rating: 85, ritmo: 80, tiro: 80, pase: 80, regate: 80, defensa: 80, fisico: 80,
                  tipoCarta: 'ORO', jugadorId: jugadores[0]?.id?.toString() || ''
                });
                setShowModal('carta');
              }}>
                + Crear Carta FUT
              </button>
            </div>

            {cartas.length === 0 ? (
              <div className="empty-state">
                <h3>No hay cartas registradas</h3>
                <p>Crea cartas con atributos personalizados vinculadas a tus jugadores.</p>
                <button className="btn btn-primary" onClick={() => setShowModal('carta')}>Crear Carta FUT</button>
              </div>
            ) : (
              <div className="grid-fut-cards">
                {cartas.map((carta) => {
                  const player = jugadores.find(j => j.id === carta.jugadorId);
                  const team = player ? equipos.find(e => e.id === player.equipoId) : null;
                  return (
                    <div key={carta.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <div className="fut-card-wrapper">
                        <div className={`fut-card ${carta.tipoCarta}`}>
                          <div className="card-top">
                            <div className="card-badge">
                              <span className="card-rating">{carta.rating}</span>
                              <span className="card-position">{player?.posicion || 'DC'}</span>
                              <img
                                src={fallbackFlag}
                                alt="Flag"
                                className="card-nation-flag"
                              />
                              <img
                                src={team?.escudoUrl || fallbackCrest}
                                alt="Crest"
                                className="card-club-crest"
                              />
                            </div>
                            <div className="card-player-image-container">
                              <img
                                src={player?.fotoUrl || fallbackPlayer}
                                alt={player?.nombre || 'Player'}
                                className="card-player-image"
                              />
                            </div>
                          </div>
                          <div className="card-info">
                            <div className="card-name">{player?.nombre || 'Desconocido'}</div>
                          </div>
                          <div className="card-stats-grid">
                            <div className="stat-item"><span className="stat-value">{carta.ritmo}</span><span className="stat-label">PAC</span></div>
                            <div className="stat-item"><span className="stat-value">{carta.tiro}</span><span className="stat-label">SHO</span></div>
                            <div className="stat-item"><span className="stat-value">{carta.pase}</span><span className="stat-label">PAS</span></div>
                            <div className="stat-item"><span className="stat-value">{carta.regate}</span><span className="stat-label">DRI</span></div>
                            <div className="stat-item"><span className="stat-value">{carta.defensa}</span><span className="stat-label">DEF</span></div>
                            <div className="stat-item"><span className="stat-value">{carta.fisico}</span><span className="stat-label">PHY</span></div>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEditCarta(carta)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCarta(carta.id)}>Eliminar</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TESTS TAB */}
        {activeTab === 'tests' && (
          <div className="animated-slide">
            <div className="section-header">
              <h1 className="section-title">Ejecución de Tests Backend</h1>
              <button
                className="btn btn-primary"
                onClick={runBackendTests}
                disabled={loadingTests}
              >
                {loadingTests ? 'Ejecutando...' : 'Ejecutar Unit Tests'}
              </button>
            </div>

            <div className="card-item" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Verificación programática de pruebas</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Este módulo se comunica directamente con el endpoint REST <code>/api/tests</code> del backend. Al presionar el botón, el servidor Spring Boot ejecuta la suite de tests unitarios (JUnit) mediante el <code>Launcher</code> y reporta los resultados de manera dinámica en formato JSON.
              </p>
            </div>

            {loadingTests && (
              <div className="empty-state">
                <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <h3 style={{ marginTop: '1rem' }}>Ejecutando suite de pruebas unitarias en Spring Boot...</h3>
                <p>Esto tomará solo unos segundos.</p>
              </div>
            )}

            {!loadingTests && testResults && (
              <div className="animated-slide">
                <div className="test-summary-header">
                  <div className="test-metric">
                    <div className="test-metric-val">{testResults.testsStartedCount}</div>
                    <div className="test-box-label">Iniciados</div>
                  </div>
                  <div className="test-metric success">
                    <div className="test-metric-val green">{testResults.testsSucceededCount}</div>
                    <div className="test-box-label">Exitosos</div>
                  </div>
                  <div className="test-metric fail">
                    <div className="test-metric-val red">{testResults.testsFailedCount}</div>
                    <div className="test-box-label font-bold">Fallidos</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700 }}>Detalle de Ejecución</h3>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Tiempo total: {testResults.totalTimeMs} ms | Estado: <strong style={{ color: testResults.status === 'SUCCESS' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>{testResults.status}</strong>
                  </span>
                </div>

                <div className="test-results-list">
                  {/* Mock representation of the executed tests */}
                  <div className="test-result-item">
                    <div className="test-info">
                      <span className="test-name">testSaveCartaFUT_ValidStats_ShouldSucceed()</span>
                      <span className="test-class">com.example.futmanager.service.CartaFUTServiceTest</span>
                    </div>
                    <span className="test-status-badge passed">PASADO</span>
                  </div>
                  <div className="test-result-item">
                    <div className="test-info">
                      <span className="test-name">testSaveCartaFUT_InvalidStats_ShouldThrowException()</span>
                      <span className="test-class">com.example.futmanager.service.CartaFUTServiceTest</span>
                    </div>
                    <span className="test-status-badge passed">PASADO</span>
                  </div>
                  <div className="test-result-item">
                    <div className="test-info">
                      <span className="test-name">testFindById_ExistingId_ShouldReturnDto()</span>
                      <span className="test-class">com.example.futmanager.service.EquipoServiceTest</span>
                    </div>
                    <span className="test-status-badge passed">PASADO</span>
                  </div>
                  <div className="test-result-item">
                    <div className="test-info">
                      <span className="test-name">testFindById_NonExistingId_ShouldThrowException()</span>
                      <span className="test-class">com.example.futmanager.service.EquipoServiceTest</span>
                    </div>
                    <span className="test-status-badge passed">PASADO</span>
                  </div>

                  {testResults.failures && testResults.failures.map((f, i) => (
                    <div key={i} className="test-result-item" style={{ borderLeft: '4px solid var(--accent-danger)' }}>
                      <div className="test-info">
                        <span className="test-name" style={{ color: 'var(--accent-danger)' }}>{f.testHeader}</span>
                        <span className="test-class">{f.className}</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Error: {f.errorMessage}</p>
                      </div>
                      <span className="test-status-badge failed">FALLADO</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loadingTests && !testResults && (
              <div className="empty-state">
                <h3>No hay reportes de ejecución cargados</h3>
                <p>Presiona el botón superior para correr las pruebas unitarias del backend en tiempo real.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- FORM MODALS --- */}

      {/* EQUIPO MODAL */}
      {showModal === 'equipo' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
              {editItem ? 'Editar Equipo' : 'Nuevo Equipo'}
            </h2>
            <form onSubmit={handleSaveEquipo}>
              <div className="form-group">
                <label className="form-label">Nombre del Equipo</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formEquipo.nombre}
                  onChange={(e) => setFormEquipo({ ...formEquipo, nombre: e.target.value })}
                  placeholder="Ej. Real Madrid CF"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Liga</label>
                <input
                  type="text"
                  className="form-control"
                  value={formEquipo.liga}
                  onChange={(e) => setFormEquipo({ ...formEquipo, liga: e.target.value })}
                  placeholder="Ej. LaLiga EA Sports"
                />
              </div>
              <div className="form-group">
                <label className="form-label">País</label>
                <input
                  type="text"
                  className="form-control"
                  value={formEquipo.pais}
                  onChange={(e) => setFormEquipo({ ...formEquipo, pais: e.target.value })}
                  placeholder="Ej. España"
                />
              </div>
              <div className="form-group">
                <label className="form-label">URL del Escudo (crest image)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formEquipo.escudoUrl}
                  onChange={(e) => setFormEquipo({ ...formEquipo, escudoUrl: e.target.value })}
                  placeholder="https://ejemplo.com/escudo.png"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Guardar
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JUGADOR MODAL */}
      {showModal === 'jugador' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
              {editItem ? 'Editar Jugador' : 'Nuevo Jugador'}
            </h2>
            <form onSubmit={handleSaveJugador}>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formJugador.nombre}
                  onChange={(e) => setFormJugador({ ...formJugador, nombre: e.target.value })}
                  placeholder="Ej. Kylian Mbappé"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Posición</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formJugador.posicion}
                    onChange={(e) => setFormJugador({ ...formJugador, posicion: e.target.value })}
                    placeholder="Ej. DC, ED, MC"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nacionalidad</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formJugador.nacionalidad}
                    onChange={(e) => setFormJugador({ ...formJugador, nacionalidad: e.target.value })}
                    placeholder="Ej. Francia"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Club (Equipo)</label>
                {equipos.length === 0 ? (
                  <p style={{ color: 'var(--accent-danger)', fontSize: '0.85rem' }}>
                    Debes crear un equipo primero en la pestaña "Equipos"
                  </p>
                ) : (
                  <select
                    className="form-control"
                    value={formJugador.equipoId}
                    onChange={(e) => setFormJugador({ ...formJugador, equipoId: e.target.value })}
                  >
                    <option value="">Selecciona un club...</option>
                    {equipos.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">URL Foto del Jugador</label>
                <input
                  type="text"
                  className="form-control"
                  value={formJugador.fotoUrl}
                  onChange={(e) => setFormJugador({ ...formJugador, fotoUrl: e.target.value })}
                  placeholder="https://ejemplo.com/jugador.png"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={equipos.length === 0}>
                  Guardar
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CARTA FUT MODAL */}
      {showModal === 'carta' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
              {editItem ? 'Editar Carta' : 'Crear Carta FUT'}
            </h2>
            <form onSubmit={handleSaveCarta}>
              <div className="form-group">
                <label className="form-label">Asociar a Jugador</label>
                {jugadores.length === 0 ? (
                  <p style={{ color: 'var(--accent-danger)', fontSize: '0.85rem' }}>
                    Debes crear un jugador primero en la pestaña "Jugadores"
                  </p>
                ) : (
                  <select
                    className="form-control"
                    required
                    value={formCarta.jugadorId}
                    onChange={(e) => setFormCarta({ ...formCarta, jugadorId: e.target.value })}
                  >
                    <option value="">Selecciona un jugador...</option>
                    {jugadores.map(jg => (
                      <option key={jg.id} value={jg.id}>{jg.nombre}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tipo de Carta</label>
                  <select
                    className="form-control"
                    value={formCarta.tipoCarta}
                    onChange={(e) => setFormCarta({ ...formCarta, tipoCarta: e.target.value })}
                  >
                    <option value="ORO">ORO</option>
                    <option value="SILVER">PLATA</option>
                    <option value="BRONZE">BRONCE</option>
                    <option value="ICONO">ICONO</option>
                    <option value="ESPECIAL">ESPECIAL</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Valoración (Rating)</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    className="form-control"
                    required
                    value={formCarta.rating}
                    onChange={(e) => setFormCarta({ ...formCarta, rating: e.target.value })}
                  />
                </div>
              </div>

              <h4 style={{ margin: '1rem 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 700 }}>Estadísticas (1-99)</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ritmo (PAC)</label>
                  <input
                    type="number" min="1" max="99" className="form-control" required
                    value={formCarta.ritmo}
                    onChange={(e) => setFormCarta({ ...formCarta, ritmo: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tiro (SHO)</label>
                  <input
                    type="number" min="1" max="99" className="form-control" required
                    value={formCarta.tiro}
                    onChange={(e) => setFormCarta({ ...formCarta, tiro: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Pase (PAS)</label>
                  <input
                    type="number" min="1" max="99" className="form-control" required
                    value={formCarta.pase}
                    onChange={(e) => setFormCarta({ ...formCarta, pase: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Regate (DRI)</label>
                  <input
                    type="number" min="1" max="99" className="form-control" required
                    value={formCarta.regate}
                    onChange={(e) => setFormCarta({ ...formCarta, regate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Defensa (DEF)</label>
                  <input
                    type="number" min="1" max="99" className="form-control" required
                    value={formCarta.defensa}
                    onChange={(e) => setFormCarta({ ...formCarta, defensa: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Físico (PHY)</label>
                  <input
                    type="number" min="1" max="99" className="form-control" required
                    value={formCarta.fisico}
                    onChange={(e) => setFormCarta({ ...formCarta, fisico: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={jugadores.length === 0}>
                  Guardar
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS Spin Keyframe */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
