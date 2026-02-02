# 📱 Spatial OS React Native SDK

[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/@spatial-os/react-native.svg)](https://www.npmjs.com/package/@spatial-os/react-native)

**React Native SDK for Spatial OS** - Build cross-platform AR applications with persistent spatial anchors.

## Features

- 📍 **Spatial Anchors** - Create and resolve world-locked content
- 🔄 **ViroReact Integration** - AR support with ViroReact
- 👥 **Real-time Presence** - Track users in shared spaces
- 🪝 **React Hooks** - Modern hooks-based API

## Installation

```bash
npm install @spatial-os/react-native
# or
yarn add @spatial-os/react-native
```

## Quick Start

```jsx
import { SpatialProvider, useAnchor, usePresence } from '@spatial-os/react-native';

function App() {
  return (
    <SpatialProvider apiKey="YOUR_API_KEY">
      <MyARScene />
    </SpatialProvider>
  );
}

function MyARScene() {
  const { anchors, createAnchor, loading } = useAnchor('my-space');
  const { users, updatePosition } = usePresence('my-space');

  const handleTap = async (position) => {
    await createAnchor({
      anchorType: 'GPS',
      position,
      payload: 'my-content',
    });
  };

  return (
    <ViroARScene onTap={handleTap}>
      {anchors.map(anchor => (
        <AnchorContent key={anchor.id} anchor={anchor} />
      ))}
    </ViroARScene>
  );
}
```

## Hooks

| Hook | Description |
|------|-------------|
| `useSpatial()` | Main client context |
| `useAnchor(spaceId)` | Anchor CRUD operations |
| `usePresence(spaceId)` | Real-time user presence |
| `usePortal()` | Cross-app navigation |

## Requirements

- React Native 0.70+
- ViroReact (for AR features)

## Support

If you find Spatial OS useful, consider supporting the project:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Us-ff5e5b?logo=ko-fi&logoColor=white)](https://ko-fi.com/nirmalbrj7)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsor-ea4aaa?logo=github&logoColor=white)](https://github.com/sponsors/nirmalbrj7)

## License

MIT License - see [LICENSE](LICENSE)
