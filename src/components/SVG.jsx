const SVG = ({ width, height = '', color = '#currentColor', name }) => {
  return (
    <>
      {name === 'favs-star' && (
        <svg
          fill={color}
          width={width}
          height={height || width}
          viewBox="-1 0 19 19"
          className="cf-icon-svg" // Cambiado de 'class' a 'className'
        >
          <path fill={color} d="M16.417 9.583A7.917 7.917 0 1 1 8.5 1.666a7.917 7.917 0 0 1 7.917 7.917zm-3.08-1.993-1.472-.174-1.485-.176-1.247-2.704c-.345-.747-.908-.747-1.253 0L6.633 7.24l-1.485.176-1.471.174c-.817.097-.991.633-.387 1.192l1.088 1.006 1.098 1.015-.292 1.467-.289 1.453c-.16.807.296 1.138 1.014.737l2.598-1.455 2.598 1.455c.717.401 1.173.07 1.013-.737l-.58-2.92 1.097-1.015 1.089-1.006c.604-.559.43-1.095-.387-1.192z" />
        </svg>
      )}

      {name === 'favs-heart-fill' && (
        <svg
          fill={color}
          width={width}
          height={height || width}
          viewBox="0 0 24 24">
          <path fill={color} fillRule="evenodd" clipRule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke={'black'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {name === 'favs-heart-big' && (
        <svg
          fill={color}
          width={width}
          height={height || width}
          viewBox="0 0 16 16">
          <path fill={color} d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" />
        </svg>
      )}

      {name === 'cart-special' && (
        <svg
          fill={color}
          width={width}
          height={height || width}
          viewBox="0 0 902.86 902.86"
        >
          <g>
            <g>
              <path fill={color} d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829zM685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z" />
              <path fill={color} d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742C469.675,776.858,518.457,825.641,578.418,825.641zM209.46,716.897c0,22.467-18.277,40.744-40.743,40.744c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897zM619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742S619.162,694.432,619.162,716.897z" />
            </g>
          </g>
        </svg>
      )}

      {name === 'cart-remove' && (
        <svg
          fill={'transparent'}
          width={width}
          height={height || width}
          viewBox="0 0 24 24" >
          <path fill={'transparent'} d="M21 5L19 12H7.37671M20 16H8L6 3H3M16 6H11M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {name === 'cart-plus' && (
        <svg
          fill={'transparent'}
          width={width}
          height={height || width}
          viewBox="0 0 24 24" >
          <path d="M21 5L19 12H7.37671M20 16H8L6 3H3M16 5.5H13.5M13.5 5.5H11M13.5 5.5V8M13.5 5.5V3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {name === 'cart-normal' && (
        <svg
          fill={'transparent'}
          width={width}
          height={height || width}
          viewBox="0 0 24 24" >
          <path d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {name === 'cart-normal-fill' && (
        <svg
          fill="none"
          width={width}
          height={height || width}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.29977 5H21L19 12H7.37671L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
            fill={color}
            stroke={'black'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.29977 5H21L19 12H7.37671L6 3H3M20 16H8L6 3H3"
            stroke={'black'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}

      {name === 'cart-go' && (
        <svg
          fill={'transparent'}
          width={width}
          height={height || width}
          viewBox="0 0 24 24" >
          <path d="M7.2998 5H22L20 12H8.37675M21 16H9L7 3H4M4 8H2M5 11H2M6 14H2M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {name === 'cart-go-fill' && (
        <svg
          width={width}
          height={height || width}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id="mask-car">
              <rect x="0" y="0" width="8" height="24" fill="black" />
              <rect x="6" y="0" width="16" height="24" fill="white" />
            </mask>
          </defs>
          <path
            d="M7.2998 5H22L20 12H8.37675L7 8H4M4 8H2M5 11H2M6 14H2L6 3H4L6 5H22L20 12H8.37675L7 5H4M4 8H2M5 11H2M6 14H2"
            fill={color}
            mask="url(#mask-car)"
          />
          <path
            d="M7.2998 5H22L20 12H8.37675M21 16H9L7 3H4M4 8H2M5 11H2M6 14H2M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20Z"
            stroke={'black'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>


      )}

      {name === 'cart-cancel' && (
        <svg
          fill={'transparent'}
          width={width}
          height={height || width}
          viewBox="0 0 24 24" >
          <path d="M21 5L19 12H7.37671M20 16H8L6 3H3M11 3L13.5 5.5M13.5 5.5L16 8M13.5 5.5L16 3M13.5 5.5L11 8M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {name === 'cart-out' && (
        <svg
          fill={'transparent'}
          width={width}
          height={height || width}
          viewBox="0 0 24 24" >
          <path d="M21 5L19 12H7.37671M20 16H8L6 3H3M13.5 3V9M13.5 3L11.5 5M13.5 3L15.5 5M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {name === 'cart-in' && (
        <svg
          fill={'transparent'}
          width={width}
          height={height || width}
          viewBox="0 0 24 24" >
          <path d="M21 5L19 12H7.37671M20 16H8L6 3H3M11.5 7L13.5 9M13.5 9L15.5 7M13.5 9V3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {name === 'star' && (

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width || "24"}
          height={height || width}
          viewBox="0 0 24 24"
          fill={color || 'transparent'}
          stroke="black"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.76 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      )}
    </>
  );
};

export default SVG;