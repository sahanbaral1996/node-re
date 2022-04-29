import * as React from 'react';

const FILL = new Map();

FILL.set('preferences', '#d69029');
FILL.set('health', '#f15b54');
FILL.set('routine', '#b91f56');
FILL.set('hormones', '#d69029');
FILL.set('personal', '#f15b54');

const SvgComponent: React.FC<any> = ({ offSet, activeHeadings, ...props }) => {
  const getFill = (type: any) => (activeHeadings.includes(type) ? FILL.get(type) : 'none');

  return (
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 96.99" {...props}>
      <title>{'Progress bar'}</title>
      <path
        d="M.48 41.19c52.87-6.66 106.8-7.29 159.33 2.46a385 385 0 0153.89 14C235.34 65 256 75.31 278.55 79.91c23.5 4.79 48.55 4.36 71.63-2.4 18.88-5.53 35.92-15.4 53.7-23.6 22.47-10.35 47-17.54 71.93-17.16 20.93.32 39.82 7.4 58.1 17.09 16.8 8.91 33.23 18.4 51.65 23.63 25.53 7.24 53.7 6.19 79.83 3a252.32 252.32 0 0062.18-16.26c17.53-6.9 34.48-15.21 52.33-21.36 19.65-6.71 40.59-10.48 61.4-9.07 18.43 1.22 35.31 7.52 51.24 16.62 14 8 27.35 17.21 42.25 23.6 18.14 7.78 37.65 10.93 57.33 10.65a159.84 159.84 0 0050.32-8.5c15.82-5.47 31-12.7 46.67-18.51 50.87-18.84 105.73-27.79 159.82-29.7 10.27-.36 20.47-.47 30.75-.3a.31.31 0 00.25-.36.3.3 0 00-.25-.25c-52-.89-104.22 5-154.48 18.51a475 475 0 00-59.56 20.79c-14.54 6.06-29.1 12-44.65 15-21.35 4-44.24 4.07-65.4-1-17.28-4.19-32.77-12.33-47.85-21.53-13.3-8.08-26.58-16.31-41.53-21-18.22-5.73-37.63-5.95-56.38-3.07C771.57 40.6 738.37 62 701.51 72.56c-25.36 7.27-51.54 9.53-77.84 9.38-25.33-.14-48.41-7-70.74-18.58-16-8.3-31.47-17.92-48.91-23-21.54-6.29-44.26-4.87-65.83.52-20.3 5.08-38.66 14.5-57.36 23.59-20.72 10.07-41.9 17.09-65.12 17.86-27.08.89-51.83-6-76.75-15.83-17.63-7-35.37-13.24-53.75-17.9-45.33-11.51-92.47-14.68-139.08-12.2-15.26.82-30.48 2.26-45.65 4.18-.38 0-.39.66 0 .61"
        fill="#3c4866"
        data-name="line base"
      />
      <path
        d="M.58 40.83C53 34.23 106.37 33.55 158.45 43a387.89 387.89 0 0154.31 13.9c21.45 7.21 41.94 17.3 64.14 22.1 24.59 5.36 51 5 75.07-2.34 19.31-5.91 36.7-16.25 55-24.45 21.68-9.64 45.33-16.21 69.19-15.82 19.93.3 38.22 6.68 55.73 15.79 17.2 9 33.81 18.92 52.53 24.48 26 7.72 54.74 6.73 81.42 3.48 21.93-2.66 43.1-8.71 63.57-16.89 17.48-7 34.44-15.24 52.31-21.22 19.27-6.43 39.79-10 60.13-8.62 17.61 1.2 33.91 7.24 49.24 15.78 14 7.83 27.18 17.06 41.87 23.69 18.81 8.49 39.22 11.72 59.79 11.43a160.4 160.4 0 0051.39-9.06c15.93-5.61 31.22-12.71 47.08-18.51 50.49-18.47 104.88-27.28 158.49-29.17 10.28-.36 19.51-.43 29.79-.26"
        fill="none"
        stroke="#f15b54"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        data-name="line solid"
        strokeDashoffset={`${offSet}px`}
        strokeDasharray="1330px"
      />
      <text
        transform="translate(944.82 42.65)"
        style={{
          isolation: 'isolate',
        }}
        fontSize={20.882}
        fill="#3c4866"
        fontFamily="VentiCF-DemiBold,Venti CF"
        fontWeight={700}
        data-name="text preferences"
      >
        <tspan letterSpacing="-.006em">{'P'}</tspan>
        <tspan x={12.01} y={0} letterSpacing="-.013em">
          {'r'}
        </tspan>
        <tspan x={19.6} y={0}>
          {'e'}
        </tspan>
        <tspan x={29.66} y={0} letterSpacing="-.033em">
          {'f'}
        </tspan>
        <tspan x={36.38} y={0}>
          {'e'}
        </tspan>
        <tspan x={46.44} y={0} letterSpacing="-.013em">
          {'r'}
        </tspan>
        <tspan x={54.03} y={0} letterSpacing="0em">
          {'en'}
        </tspan>
        <tspan x={74.67} y={0} letterSpacing="-.008em">
          {'c'}
        </tspan>
        <tspan x={83.5} y={0} letterSpacing="0em">
          {'es'}
        </tspan>
      </text>
      <path
        data-name="dot fill preferences"
        d="M999.48 74.57a11 11 0 107.07 12 13.57 13.57 0 00.13-1.68 11.13 11.13 0 00-7.2-10.32z"
        fill="#fafafa"
      />
      <path
        data-name="dot main preferences"
        d="M1005.06 83.61a10.67 10.67 0 11-10.67-10.67 10.67 10.67 0 0110.67 10.67"
        fill={getFill('preferences')}
      />
      <path
        data-name="dot outline preferences"
        d="M999.48 74.57a11 11 0 107.07 12 13.57 13.57 0 00.13-1.68 11.13 11.13 0 00-7.2-10.32z"
        fill="none"
        stroke="#3c4866"
        strokeMiterlimit={10}
      />
      <text
        transform="translate(791.72 85.78)"
        style={{
          isolation: 'isolate',
        }}
        fontSize={20.882}
        fill="#3c4866"
        fontFamily="VentiCF-DemiBold,Venti CF"
        fontWeight={700}
      >
        {'He '}
        <tspan x={24.5} y={0} letterSpacing=".004em">
          {'a'}
        </tspan>
        <tspan x={34.25} y={0}>
          {'lth'}
        </tspan>
      </text>
      <path
        data-name="dot fill health"
        d="M822.6 24.21a11 11 0 107.06 12 11.63 11.63 0 00.13-1.67 11.09 11.09 0 00-7.19-10.33z"
        fill="#fafafa"
      />
      <path
        data-name="dot main health"
        d="M829.4 33.25a10.67 10.67 0 11-10.67-10.67 10.67 10.67 0 0110.67 10.67"
        fill={getFill('health')}
      />
      <path
        data-name="dot outline health"
        d="M822.6 24.21a11 11 0 107.06 12 11.63 11.63 0 00.13-1.67 11.09 11.09 0 00-7.19-10.33z"
        fill="none"
        stroke="#3c4866"
        strokeMiterlimit={10}
      />
      <text
        transform="translate(602.5 43.26)"
        style={{
          isolation: 'isolate',
        }}
        fontSize={20.882}
        fill="#3c4866"
        fontFamily="VentiCF-DemiBold,Venti CF"
        fontWeight={700}
      >
        <tspan letterSpacing="-.017em">{'R'}</tspan>
        <tspan x={12.36} y={0} letterSpacing="-.004em">
          {'o'}
        </tspan>
        <tspan x={22.72} y={0}>
          {'utine'}
        </tspan>
      </text>
      <path
        data-name="dot fill routine"
        d="M638.34 70.28a11 11 0 107.07 12 11.87 11.87 0 00.12-1.68 11.06 11.06 0 00-7.19-10.32z"
        fill="#fafafa"
      />
      <path
        data-name="dot main routine"
        d="M645.15 81.77a10.67 10.67 0 11-10.67-10.67 10.67 10.67 0 0110.67 10.67"
        fill={getFill('routine')}
      />
      <path
        data-name="dot outline routine"
        d="M638.34 70.28a11 11 0 107.07 12 11.87 11.87 0 00.12-1.68 11.06 11.06 0 00-7.19-10.32z"
        fill="none"
        stroke="#3c4866"
        strokeMiterlimit={10}
      />
      <text
        transform="translate(426.04 85.78)"
        style={{
          isolation: 'isolate',
        }}
        fontSize={20.882}
        fill="#3c4866"
        fontFamily="VentiCF-DemiBold,Venti CF"
        fontWeight={700}
      >
        {'Hor '}
        <tspan x={32.74} y={0} letterSpacing="-.006em">
          {'m'}
        </tspan>
        <tspan x={48.58} y={0} letterSpacing="-.008em">
          {'o'}
        </tspan>
        <tspan x={58.85} y={0}>
          {'nes'}
        </tspan>
      </text>
      <path
        data-name="dot fill hormones"
        d="M473.74 26.05a11 11 0 107.06 12 10.56 10.56 0 00.13-1.68 11.1 11.1 0 00-7.19-10.32z"
        fill="#fafafa"
      />
      <path
        data-name="dot main hormones"
        d="M481.77 36.32a10.67 10.67 0 11-10.67-10.67 10.67 10.67 0 0110.67 10.67"
        fill={getFill('hormones')}
      />
      <path
        data-name="dot outline hormones"
        d="M473.74 26.05a11 11 0 107.06 12 10.56 10.56 0 00.13-1.68 11.1 11.1 0 00-7.19-10.32z"
        fill="none"
        stroke="#3c4866"
        strokeMiterlimit={10}
      />
      <text
        transform="translate(271.07 43.26)"
        style={{
          isolation: 'isolate',
        }}
        fontSize={20.882}
        fill="#3c4866"
        fontFamily="VentiCF-DemiBold,Venti CF"
        fontWeight={700}
        data-name="text personal"
      >
        {'Pe '}
        <tspan x={22.2} y={0} letterSpacing="-.008em">
          {'r'}
        </tspan>
        <tspan x={29.88} y={0} letterSpacing="-.006em">
          {'s'}
        </tspan>
        <tspan x={37.82} y={0} letterSpacing="-.008em">
          {'o'}
        </tspan>
        <tspan x={48.1} y={0}>
          {'n'}
        </tspan>
        <tspan x={58.67} y={0} letterSpacing=".004em">
          {'a'}
        </tspan>
        <tspan x={68.42} y={0}>
          {'l'}
        </tspan>
      </text>
      <path
        data-name="dot fill personal"
        d="M309.75 70.89a11 11 0 107.07 12 11.87 11.87 0 00.12-1.68 11.06 11.06 0 00-7.19-10.32z"
        fill="#fafafa"
      />
      <path
        data-name="dot main personal"
        d="M315.33 81.15a10.67 10.67 0 11-10.67-10.67 10.67 10.67 0 0110.67 10.67"
        fill={getFill('personal')}
      />
      <path
        data-name="dot outline personal"
        d="M309.75 70.89a11 11 0 107.07 12 11.87 11.87 0 00.12-1.68 11.06 11.06 0 00-7.19-10.32z"
        fill="none"
        stroke="#3c4866"
        strokeMiterlimit={10}
      />
    </svg>
  );
};

export default SvgComponent;
