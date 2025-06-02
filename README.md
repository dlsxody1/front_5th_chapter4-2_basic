# Core Web Vitals 기반 성능 최적화 계획

## 🚨 긴급 수정 (Lighthouse 점수 기반)

### 1. Total Blocking Time 개선

- [ ] **메인 스레드 블로킹 연산 제거**: `for (let i = 0; i < 10000000; i++)` 루프 완전 제거
- [ ] **DOM 조작 최적화**: `displayProducts()` 함수에서 DocumentFragment 사용
- [ ] **setTimeout 최적화**: `showTopBar()` 함수의 1초 지연을 requestAnimationFrame으로 변경
- [ ] **이벤트 리스너 배치**: DOMContentLoaded 이후로 이벤트 등록 지연

### 2. First Contentful Paint 개선

- [ ] **Critical CSS 인라인화**: Above-the-fold 스타일을 HTML 내부로 이동
- [ ] **폰트 최적화**: `font-display: swap` 추가 및 폰트 프리로드
- [ ] **CSS 로딩 순서**: 비중요 CSS를 비동기로 로드
- [ ] **HTML 압축**: 불필요한 공백 및 주석 제거

### 3. Largest Contentful Paint 개선 (15.2초 → 목표: <2.5초)

- [ ] **Hero 이미지 최적화**: WebP 포맷 변환 및 적절한 크기 설정
- [ ] **이미지 프리로드**: Hero 이미지에 `<link rel="preload">` 적용
- [ ] **제품 이미지 지연 로딩**: Intersection Observer로 viewport 진입 시 로드

## 📱 이미지 리소스 최적화

### 포맷 및 압축

- [ ] **WebP 변환**: 모든 이미지를 WebP 포맷으로 변환 (fallback: JPEG)

### 로딩 전략

- [ ] **지연 로딩**: 제품 이미지에 `loading="lazy"` 속성 추가
- [ ] **프리로드 우선순위**: Hero 이미지만 즉시 로드, 나머지는 지연

## ⚡ JS/CSS 로딩 최적화

### JavaScript 최적화

- [ ] **코드 스플리팅**: `loadProducts()` 함수를 별도 모듈로 분리
- [ ] **동적 import**: 제품 관련 기능을 필요 시점에 로드
- [ ] **번들 크기 최소화**: 트리 쉐이킹으로 미사용 코드 제거
- [ ] **압축 및 난독화**: Terser로 JavaScript 압축

### CSS 최적화

- [ ] **Critical CSS 추출**: Above-the-fold 스타일만 인라인으로 포함
- [ ] **CSS 청크**: 페이지별 필요한 CSS만 로드
- [ ] **미사용 CSS 제거**: PurgeCSS로 불필요한 스타일 정리
- [ ] **CSS 압축**: cssnano로 파일 크기 최소화

### 리소스 힌트

- [ ] **DNS 프리페치**: `<link rel="dns-prefetch" href="//fakestoreapi.com">`
- [ ] **프리커넥트**: 중요한 외부 리소스 연결 미리 설정
- [ ] **모듈 프리로드**: 중요한 JS 모듈 우선 로드

## 🎮 이벤트 관리

### 이벤트 위임

- [ ] **제품 버튼 이벤트**: 컨테이너에 단일 이벤트 리스너 등록
- [ ] **메모리 누수 방지**: 페이지 언로드 시 이벤트 리스너 정리
- [ ] **패시브 이벤트**: 스크롤/터치 이벤트에 `{passive: true}` 옵션

### 성능 최적화

- [ ] **디바운싱**: 스크롤/리사이즈 이벤트에 디바운스 적용
- [ ] **스로틀링**: 자주 발생하는 이벤트 제한
- [ ] **이벤트 풀링**: 자주 사용되는 이벤트 객체 재사용

## 🎨 애니메이션 최적화

### CSS 애니메이션

- [ ] **transform 활용**: position 대신 transform으로 애니메이션
- [ ] **GPU 가속**: `will-change` 속성 또는 `transform3d()` 활용

### JavaScript 애니메이션

- [ ] **requestAnimationFrame**: setTimeout 대신 RAF 사용
- [ ] **배치 업데이트**: DOM 변경사항을 배치로 처리
