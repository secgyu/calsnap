# CalSnap

음식 사진을 촬영하면 AI가 칼로리와 영양소를 분석해주는 모바일 앱입니다.

## 프로젝트 구조

```
calsnap/          # React Native (Expo) 프론트엔드
calsnap-server/   # NestJS 백엔드
```

## Tech Stack

### Frontend
- React Native (Expo SDK 54)
- TypeScript
- expo-router (파일 기반 라우팅)
- expo-camera / expo-image-picker

### Backend
- NestJS
- TypeScript
- PostgreSQL (예정)
- JWT 인증 (예정)

## 시작하기

### Frontend
```bash
cd calsnap
npm install
npx expo start
```

### Backend
```bash
cd calsnap-server
npm install
npm run start:dev
```
