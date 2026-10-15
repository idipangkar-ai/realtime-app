import Svg, { Path } from 'react-native-svg';

function createIcon(paths) {
  return function Icon({
    size = 24,
    color = 'currentColor',
    strokeWidth = 1.7,
    fill = 'none',
  }) {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        accessible={false}
      >
        {paths.map((d, index) => (
          <Path key={index} d={d} />
        ))}
      </Svg>
    );
  };
}

export const Menu = createIcon(['M4 6h16M4 12h16M4 18h16']);
export const Search = createIcon([
  'M21 21l-5-5',
  'M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0',
]);
export const MessageCircle = createIcon([
  'M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.7-4.5A9 9 0 1 1 21 11.5Z',
]);
export const ArrowLeft = createIcon(['m12 5-7 7 7 7M5 12h14']);
export const Home = createIcon(['m3 10 9-7 9 7v10H3Z', 'M9 20v-7h6v7']);
export const UserRound = createIcon([
  'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  'M4 21v-2a8 8 0 0 1 16 0v2',
]);
export const Package = createIcon([
  'm12 3 9 5v9l-9 5-9-5V8Z',
  'm3 8 9 5 9-5M12 13v9M7.5 5.5l9 5',
]);
export const Grid2X2 = createIcon([
  'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z',
]);
export const X = createIcon(['m6 6 12 12M6 18 18 6']);
export const ArrowUpRight = createIcon(['M7 17 17 7M7 7h10v10']);
export const Star = createIcon([
  'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z',
]);
