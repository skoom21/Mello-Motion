import React from 'react';
import styled from 'styled-components';

interface GenerateButtonProps {

  onClick: () => void;

  loading: boolean;

  text: string;

}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, loading, text }) => {
  return (
    <StyledWrapper>
      <button className="btn" onClick={onClick} disabled={loading}>
      {loading ? (
        <svg height={24} width={24} viewBox="0 0 50 50" className="spinner">
          <circle cx="25" cy="25" r="20" stroke="#D3B4FF" strokeWidth="5" fill="none" />
          <circle cx="25" cy="25" r="20" stroke="#AAAAAA" strokeWidth="5" fill="none" strokeDasharray="31.4" strokeDashoffset="31.4">
        <animate
          attributeName="stroke-dashoffset"
          values="31.4;0"
          dur="1s"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
          </circle>
        </svg>

) : (
        <svg height={24} width={24} fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
        </svg>
      )}
      <span className="text">{loading ? 'Loading...' : text}</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
    border: none;
    width: 15em;
    height: 4em;
    border-radius: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    background: #1C1A1C;
    cursor: pointer;
    transition: all 450ms ease-in-out;
  }

  .sparkle {
    fill: #AAAAAA;
    transition: all 800ms ease;
  }

  .text {
    font-weight: 600;
    color: #D3B4FF; /* Light purple color */
    font-size: medium;
  }

  .btn:hover {
    background: linear-gradient(0deg,#A47CF3,#683FEA);
    box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
    inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2),
    0px 0px 0px 4px rgba(255, 255, 255, 0.2),
    0px 0px 180px 0px #9917FF;
    transform: translateY(-2px);
  }

  .btn:hover .text {
    color: white;
  }

  .btn:hover .sparkle {
    fill: white;
    transform: scale(1.2);
  }`;

export default GenerateButton;
