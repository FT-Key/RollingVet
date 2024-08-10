import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import { Container } from 'react-bootstrap';
import '../css/RouteInputButton.css';

const RouteInputButton = () => {
  const [routeInput, setRouteInput] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [domainsRoutes, setDomainsRoutes] = useState({});
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [tags, setTags] = useState([]);
  const [defaultDomains, setDefaultDomains] = useState([]);
  const [defaultDomain, setDefaultDomain] = useState('localhost:3001');
  const [viewKeys, setViewKeys] = useState(false);
  const [viewDomain, setViewDomain] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const VIEWKEYS_CONFIG = screenWidth > 768
    ? {
      true: { text: '🠺', color: 'danger' },
      false: { text: '🠸', color: 'success' },
    }
    : {
      true: { text: '🠹', color: 'danger' },
      false: { text: '🠻', color: 'success' },
    };

  const VIEWDOMAIN_CONFIG = screenWidth > 768
    ? {
      true: { text: '🠸', color: 'danger' },
      false: { text: '🠺', color: 'success' },
    }
    : {
      true: { text: '🠹', color: 'danger' },
      false: { text: '🠻', color: 'success' },
    };

  // UseEffect inicial

  useEffect(() => {
    const savedDomainsRoutes = JSON.parse(localStorage.getItem('domainsRoutes')) || {};
    setDomainsRoutes(savedDomainsRoutes);
    const savedDefaultDomains = JSON.parse(localStorage.getItem('defaultDomains')) || [];
    setDefaultDomains(savedDefaultDomains);
    const savedDefaultDomain = localStorage.getItem('defaultDomain') || 'localhost:3001';
    setDefaultDomain(savedDefaultDomain);

    const handleKeyDownPlus = (e) => {
      switch (true) {
        case e.key === '+':
          setViewKeys(prevViewKeys => !prevViewKeys);
          break;

        case e.key === '-':
          setViewDomain(prevViewDomain => !prevViewDomain);
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDownPlus);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('keydown', handleKeyDownPlus);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Estilos y drop de los div complementarios (keys-div y domain-div)

  useEffect(() => {
    const applyClasses = () => {
      const container = document.querySelector('.container-get');
      const divFetch = document.querySelector('.fetch-div');
      const divKeys = document.querySelector('.keys-div');
      const divDomains = document.querySelector('.domains-div');

      const containerWidth = parseFloat(window.getComputedStyle(container).width);

      if (containerWidth >= 768) {
        // Reset classes
        (() => {
          divFetch.classList.remove('w-100', 'w-50', 'w-33', 'w-0', 'h-auto', 'py-2');
          divDomains.classList.remove('w-100', 'w-50', 'w-33', 'w-0', 'h-auto', 'py-2', 'show');
          divKeys.classList.remove('w-100', 'w-50', 'w-33', 'w-0', 'h-auto', 'py-2', 'show');
        })();

        // Apply classes based on viewKeys and viewDomain
        switch (true) {
          case viewKeys === false && viewDomain === false:
            divFetch.classList.add('w-100');
            divKeys.classList.add('w-0');
            divDomains.classList.add('w-0');
            break;

          case viewKeys && viewDomain === false:
            divFetch.classList.add('w-50');
            divKeys.classList.add('w-50', 'show');
            divDomains.classList.add('w-0');
            break;

          case viewKeys === false && viewDomain:
            divFetch.classList.add('w-50');
            divKeys.classList.add('w-0');
            divDomains.classList.add('w-50', 'show');
            break;

          case viewKeys && viewDomain:
            divFetch.classList.add('w-33');
            divKeys.classList.add('w-33', 'show');
            divDomains.classList.add('w-33', 'show');
            break;

          default:
            break;
        }

      } else if (containerWidth < 768) {
        // Reset classes
        (() => {
          divFetch.classList.remove('w-100', 'w-50', 'w-33', 'w-0', 'h-auto', 'py-2');
          divDomains.classList.remove('w-100', 'w-50', 'w-33', 'w-0', 'h-auto', 'py-2', 'show');
          divKeys.classList.remove('w-100', 'w-50', 'w-33', 'w-0', 'h-auto', 'py-2', 'show');
        })();

        // Apply classes based on viewKeys and viewDomain
        switch (true) {

          case viewKeys && viewDomain === false:
            divKeys.classList.add('show', 'py-2');
            break;

          case viewKeys === false && viewDomain:
            divDomains.classList.add('show', 'py-2');
            break;

          case viewKeys && viewDomain:
            divKeys.classList.add('show', 'py-2');
            divDomains.classList.add('show', 'py-2');
            break;

          default:
            break;
        }
      }

    };

    applyClasses();

    // Optionally, you can add a resize listener to reapply classes on window resize
    const handleResize = () => {
      applyClasses();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [viewKeys, viewDomain]);

  // Mostrador de la URL completa

  const combinedUrl = useMemo(() => {
    if (domainInput) {
      const dominio = `http://${domainInput}/`;
      return `${dominio}${routeInput}`;
    } else if (routeInput) {
      return `http://${defaultDomain}/${routeInput}`;
    }
    return `http://${defaultDomain}`;
  }, [routeInput, domainInput, defaultDomain]);

  // Dominio por defecto

  const handleDefaultDomainAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !defaultDomains.includes(value)) {
        const updatedDefaultDomains = [...defaultDomains, value];
        saveDefaultDomains(updatedDefaultDomains);
      }
      saveDefaultDomain(value);
      e.target.value = '';
    }
  };

  const saveDefaultDomain = (value) => {
    setDefaultDomain(value);
    localStorage.setItem('defaultDomain', value);
  }

  const saveDefaultDomains = (updatedDefaultDomains) => {
    localStorage.setItem('defaultDomains', JSON.stringify(updatedDefaultDomains));
    setDefaultDomains(updatedDefaultDomains);
  };

  // Autocompletado del fetch-div

  useEffect(() => {
    if (domainInput && domainsRoutes[domainInput]) {
      setFilteredRoutes(Array.from(new Set(domainsRoutes[domainInput])));
    } else if (!domainInput && domainsRoutes[defaultDomain]) {
      setFilteredRoutes(Array.from(new Set(domainsRoutes[defaultDomain])));
    } else {
      setFilteredRoutes([]);
    }
  }, [domainInput, domainsRoutes, defaultDomain]);

  const saveDomainsAndRoutes = () => {
    if (routeInput) {
      const domain = domainInput || defaultDomain;
      const updatedDomainsRoutes = {
        ...domainsRoutes,
        [domain]: Array.from(new Set([...domainsRoutes[domain] || [], routeInput])).filter(Boolean)
      };
      localStorage.setItem('domainsRoutes', JSON.stringify(updatedDomainsRoutes));
      setDomainsRoutes(updatedDomainsRoutes);
    }
  };

  // Manejadores

  const handleRouteChange = (e) => {
    setRouteInput(e.target.value);
  };

  const handleDomainChange = (e) => {
    setDomainInput(e.target.value);
  };

  const handleRedirect = () => {
    if (routeInput) {
      const dominio = domainInput ? `http://${domainInput}/` : `http://${defaultDomain}/`;
      saveDomainsAndRoutes();
      const encodedTags = encodeURIComponent(JSON.stringify(tags));
      navigate(`/serverResponse?ruta=${encodeURIComponent(routeInput)}&dominio=${encodeURIComponent(dominio)}&tags=${encodedTags}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRedirect();
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        e.target.value = '';
      }
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };
  
  const handleViewDomain = () => {
    setViewDomain(!viewDomain);
  };

  const handleViewKeys = () => {
    setViewKeys(!viewKeys);
  };

  return (
    <Container fluid className={`container-get${viewKeys && screenWidth > 768 ? ' pe-2' : ' pe-0'}${viewDomain && screenWidth > 768 ? ' ps-2' : ' ps-0'}`}>

      <div className={`domains-div center-column`}>
        <h3 className='text-center mb-3'>Dominio por defecto</h3>
        <input
          type="text"
          onKeyDown={handleDefaultDomainAdd}
          placeholder="Ingrese un dominio (sin http://)"
          className="form-control"
          style={{ maxWidth: '300px', margin: '0 auto' }}
          list={'defaultDomains'}
        />
        <datalist id="defaultDomains">
          {defaultDomains.map((domain, index) => (
            <option key={index} value={domain} />
          ))}
        </datalist>
      </div>

      <div className={`d-flex fetch-div`}>

        <CustomButton
          center={false}
          className={`ms-auto p-0 d-flex ${viewDomain ? 'me-2' : 'me-0'}`}
          btnClassName='p-0 btn-drop'
          variant={VIEWDOMAIN_CONFIG[viewDomain].color}
          buttonText={VIEWDOMAIN_CONFIG[viewDomain].text}
          onClick={handleViewDomain}
          paddingB={false}
        />

        <div className={`center-column flex-fill pe-2`}>

          <abbr title={combinedUrl} className={'text-decoration-none combinedUrl abbr'}>
            <h3 className='text-center combinedUrl m-0'>{combinedUrl}</h3>
          </abbr>

          <input
            type="text"
            value={domainInput}
            onChange={handleDomainChange}
            onKeyDown={handleKeyDown}
            placeholder="Ingrese el dominio (sin http://)"
            className="form-control my-3"
            style={{ maxWidth: '300px', margin: '0 auto' }}
            list="domains"
          />
          <datalist id="domains">
            {Object.keys(domainsRoutes).filter(domain => domain !== defaultDomain).map((domain, index) => (
              <option key={index} value={domain} />
            ))}
          </datalist>
          <input
            type="text"
            value={routeInput}
            onChange={handleRouteChange}
            onKeyDown={handleKeyDown}
            placeholder="Ingrese la ruta"
            className="form-control my-3"
            style={{ maxWidth: '300px', margin: '0 auto' }}
            list="routes"
          />
          <datalist id="routes">
            {filteredRoutes.map((route, index) => (
              <option key={index} value={route} />
            ))}
          </datalist>
          <CustomButton
            className={"pb-2"}
            variant={"primary"}
            buttonText={"Ir a ServerResponse"}
            onClick={handleRedirect}
          />
        </div>

        <CustomButton
          center={false}
          className={`ms-auto p-0 d-flex ${viewKeys ? 'me-2' : 'me-0'}`}
          btnClassName='p-0 btn-drop'
          variant={VIEWKEYS_CONFIG[viewKeys].color}
          buttonText={VIEWKEYS_CONFIG[viewKeys].text}
          onClick={handleViewKeys}
          paddingB={false}
        />

      </div>

      <div className={`keys-div`}>
        <h3 className='text-center mb-3'>Keys</h3>
        <div className="label-counter border border-secondary rounded p-1">
          {tags.map((tag, index) => (
            <span key={index} className="badge bg-secondary me-2 d-inline-flex align-items-center">
              {tag}
              <button onClick={() => handleTagDelete(tag)} className="btn-close btn-close-white ms-2" aria-label="Close"></button>
            </span>
          ))}
        </div>
        <input
          type="text"
          onKeyDown={handleTagAdd}
          placeholder="Agregar etiqueta"
          className="form-control"
          style={{ maxWidth: '300px', margin: '0 auto' }}
        />
      </div>

    </Container >
  );
};

export default RouteInputButton;