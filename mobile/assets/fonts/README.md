Font bundling instructions for NAFA Marché Connect

1) Preferred approach (Expo):
   - Install packages:
     - expo install expo-font @expo-google-fonts/poppins @expo-google-fonts/inter
   - Load fonts early (example in loadFonts.tsx)

2) React Native CLI:
   - Download desired font files (Poppins, Inter) and place them in this folder.
   - Add a react-native.config.js at the mobile root pointing to `./mobile/assets/fonts` and run `npx react-native-asset` (or follow platform-specific linking).

3) Files: place `.ttf` files here named like `Poppins-Regular.ttf`, `Poppins-Bold.ttf`, `Inter-Regular.ttf`, etc.

See `mobile/app/loadFonts.tsx` for example code to load fonts and provide them via context.
